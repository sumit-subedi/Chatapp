import json, os, django
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from channels.db import database_sync_to_async

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatapp.settings')
django.setup()
from .models import AnonymousUser  # Import the AnonymousUser model

def generate_short_user_id():
    # Generate a random UUID, take the hex representation, and return the first 4 characters
    return uuid.uuid4().hex[:4]

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        query_params = parse_qs(self.scope["query_string"].decode())
        user_id = query_params.get("user_id", [None])[0]

        if user_id and user_id.isalnum():
            self.user, _ = await self.get_or_create_anonymous_user(user_id)
            self.user_group_name = f"user_{self.user.user_id}"
            self.room_group_name = None  # Initialize room group as None

            if not hasattr(self, 'is_user_added') or not self.is_user_added:
                await self.channel_layer.group_add(
                    self.user_group_name,
                    self.channel_name
                )
                self.is_user_added = True  # Track that user has been added

            await self.set_user_online(True)
            await self.accept()
        else:
            # Reject the connection if no valid user_id is provided
            await self.close()

    async def disconnect(self, close_code):
        # Set user as offline when they disconnect
        await self.set_user_online(False)

        # Remove the user from their WebSocket group
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )

        # Remove from room group if connected
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    @database_sync_to_async
    def set_user_online(self, status):
        # Set user's online status
        AnonymousUser.objects.filter(user_id=self.user.user_id).update(is_online=status)

    @database_sync_to_async
    def set_user_available(self, user_id, status):
        # Update the availability of the user
        AnonymousUser.objects.filter(user_id=user_id).update(is_available=status)

    @database_sync_to_async
    def get_or_create_anonymous_user(self, user_id):
        # Get or create the anonymous user based on user_id
        return AnonymousUser.objects.get_or_create(user_id=user_id)

    @database_sync_to_async
    def get_anonymous_user(self, user_id):
        # Retrieve anonymous user by user_id
        try:
            return AnonymousUser.objects.get(user_id=user_id)
        except AnonymousUser.DoesNotExist:
            return None

    async def receive(self, text_data):
        # Handle incoming WebSocket messages
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'connection_request':
            target_user_id = data.get('target_user_id')
            await self.handle_connection_request(target_user_id)

        elif message_type == 'connection_response':
            requesting_user_id = data.get('requesting_user_id')
            accepted = data.get('accepted')
            await self.handle_connection_response(requesting_user_id, accepted)

        elif message_type == 'message':
            message = data.get('message')

            if self.room_group_name:
                print("Sending message to the group")
                # Broadcast the message to the shared room
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': f"{self.user.user_id}: {message}",
                        'sender_id': self.user.user_id

                    }
                )
            else:
                # Notify the sender that no active connection exists
                await self.send(json.dumps({
                    'type': 'error',
                    'message': 'No active connection to send messages.'
                }))

    async def chat_message(self, event):
        if event['sender_id'] != self.user.user_id:
            await self.send(json.dumps({
                'type': 'message',
                'message': event['message'],
            }))

    async def handle_connection_request(self, target_user_id):
        # Check if target user exists and is available
        target_user = await self.get_anonymous_user(target_user_id)
        if not target_user :
            # Notify the requesting user of connection failure
            await self.send(json.dumps({
                'type': 'connection_failed',
                'message': 'User is unavailable or offline.'
            }))
            return

        # Send connection request notification to the target user
        await self.channel_layer.group_send(
            f"user_{target_user_id}",
            {
                'type': 'connection_request_notification',
                'user_id': self.user.user_id
            }
        )

    async def handle_connection_response(self, requesting_user_id, accepted):
        if accepted:
            # Create a shared group for both users
            shared_room_group = f"chat_{min(requesting_user_id, self.user.user_id)}_{max(requesting_user_id, self.user.user_id)}"

            # Remove the current user from their individual user group
            await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
            )

            # Add current user to the shared group
            if self.room_group_name != shared_room_group:
                await self.channel_layer.group_add(
                    shared_room_group,
                    self.channel_name
                )
                print(self.user.user_id + "added to the group", shared_room_group)

            

            # Notify requesting user to join the shared group
            await self.channel_layer.group_send(
                f"user_{requesting_user_id}",
                {
                    'type': 'join_shared_group',
                    'group_name': shared_room_group,
                    'user_id': self.user.user_id

                }
            )

            # Notify the current user about the successful connection
            await self.send(json.dumps({
                'type': 'connection_established',
                'user_id': requesting_user_id,
                'room_group': shared_room_group
            }))

            # Update the room group for future messaging
            self.room_group_name = shared_room_group
        else:
            # Notify the requesting user that the connection was rejected
            await self.channel_layer.group_send(
                f"user_{requesting_user_id}",
                {
                    'type': 'connection_rejected',
                    'user_id': self.user.user_id
                }
            )


    async def join_shared_group(self, event):
        group_name = event['group_name']
        user_id = event['user_id']

        # Check if the user is already part of this group
        if self.room_group_name != group_name:
            # Add the user to the new group
            await self.channel_layer.group_add(
                group_name,
                self.channel_name
            )
            print(f"{self.user.user_id} added to the group {self.room_group_name}")
            

            # If the user was already in a previous group, discard them from it
            if self.room_group_name:
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
                print(f"{self.user.user_id} removed from the group {self.room_group_name}")

            # Update the user's current room group
            self.room_group_name = group_name

        # Send confirmation of successful group join to the user
        await self.send(json.dumps({
            'type': 'connection_established',
            'user_id': user_id,
            'room_group': group_name
        }))


    async def connection_request_notification(self, event):
        # Notify the target user about the connection request
        await self.send(json.dumps({
            'type': 'connection_request',
            'user_id': event['user_id']
        }))

    async def connection_rejected(self, event):
        # Notify the requesting user that the connection was rejected
        await self.send(json.dumps({
            'type': 'connection_rejected',
            'user_id': event['user_id']
        }))
