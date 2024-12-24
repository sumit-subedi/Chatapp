from django.core.management.base import BaseCommand
import redis

class Command(BaseCommand):
    help = "Listen for Redis key expiration events"

    def handle(self, *args, **kwargs):
        redis_client = redis.Redis(host='localhost', port=6379, db=0)

        pubsub = redis_client.pubsub()
        pubsub.psubscribe('__keyevent@0__:expired')  # Listen for key expiration events in DB 0

        self.stdout.write("Listening for expired keys...")

        for message in pubsub.listen():
            if message['type'] == 'pmessage':
                expired_key = message['data'].decode('utf-8')
                if expired_key.startswith("user:") and ":online" in expired_key:
                    user_id = expired_key.split(":")[1]
                    redis_client.srem("online_users", user_id)
                    self.stdout.write(f"Removed {user_id} from online users")
