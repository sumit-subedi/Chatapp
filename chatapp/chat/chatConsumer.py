from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
import json
import redis

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user1_id = self.scope['url_route']['kwargs']['user1_id']
        self.user2_id = self.scope['url_route']['kwargs']['user2_id']
        print("Connecting", self.user1_id, self.user2_id)

        # Mark the user as online in the cache
        redis_client.sadd("online_users", self.user1_id)


        sorted_ids = sorted([self.user1_id, self.user2_id])
        self.room_group_name = f"chat_{sorted_ids[0]}_{sorted_ids[1]}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        redis_client.srem("online_users", self.user1_id)


    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({'message': message}))
