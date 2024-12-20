import redis
from rest_framework.views import APIView
from django.core.cache import cache
from rest_framework.response import Response
from .models import AnonymousUser


redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

# Receive request from user to login into the chatapp
# TODO: Check for any query like I agree on request object before creating new user and sending back id  
class AnonymousLoginView(APIView):
    def post(self, request):
        user = AnonymousUser.objects.create()
        cache.set(f"user_online_{user.id}", True, timeout=3600)  

        return Response({'user_id': str(user.user_id)})
    
class HeartbeatView(APIView):
    def post(self, request):
        user_id = request.COOKIES.get("user_id")
        if user_id:
            redis_client.sadd("online_users", user_id)
            redis_client.expire(f"user:{user_id}:online", 60)  # 1-minute timeout
            return Response({"status": "success"})
        return Response({"status": "error", "message": "User ID not found"}, status=400)    

class OnlineUsersView(APIView):
    def get(self, request):
        online_users = redis_client.smembers("online_users")
        return Response({"online_users": list(map(lambda x: x.decode(), online_users))})

class CheckUserStatus(APIView):
    def get(self, request, user_id):
        print("here", user_id, request)
        is_online = redis_client.sismember("online_users", user_id)
        return Response({"user_id": user_id, "online": bool(is_online)})