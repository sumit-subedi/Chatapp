import redis
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from .models import AnonymousUser
import logging
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


logger = logging.getLogger(__name__)

# Initialize Redis client
try:
    redis_client = redis.StrictRedis(
        host='localhost',
        port=6379,
        db=0,
        decode_responses=True  # Automatically decode bytes to strings
    )
except redis.ConnectionError as e:
    logger.error(f"Failed to connect to Redis: {e}")
    raise

class AnonymousLoginView(APIView):
    def post(self, request):
        try:
            user_agreement = request.data.get('agreement', False)
            if not user_agreement:
                return Response({
                    'status': 'error',
                    'message': 'User must agree to terms'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create new anonymous user
            user = AnonymousUser.objects.create()
            
            # Set user as online in Redis
            redis_client.sadd("online_users", str(user.user_id))
            redis_client.set(f"user:{user.user_id}:online", "true", ex=3600)  # 1-hour timeout
            
            # Create response with cookie
            response = Response({
                'status': 'success',
                'user_id': str(user.user_id)
            })
            
            # Set cookie with user_id
            response.set_cookie(
                'user_id',
                str(user.user_id),
                max_age=3600,  # 1 hour
                httponly=True,  # Cookie not accessible via JavaScript
                samesite='Lax'  # CSRF protection
            )
            
            return response

        except Exception as e:
            logger.error(f"Error in AnonymousLoginView: {e}")
            return Response({
                'status': 'error',
                'message': 'Failed to create anonymous user'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HeartbeatView(APIView):
    def post(self, request):
        user_id = request.COOKIES.get("user_id")
        
        if not user_id:
            return Response({
                "status": "error",
                "message": "User ID not found"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Update user's online status in Redis
            pipe = redis_client.pipeline()
            pipe.sadd("online_users", user_id)
            pipe.set(f"user:{user_id}:online", "true", ex=60)  # 1-minute expiration
            pipe.execute()

            return Response({"status": "success"})

        except redis.RedisError as e:
            logger.error(f"Redis error in HeartbeatView: {e}")
            return Response({
                "status": "error",
                "message": "Failed to update online status"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OnlineUsersView(APIView):
    def get(self, request):
        try:
            # Get all online users from Redis
            online_users = redis_client.smembers("online_users")
            
            # Verify each user's individual online status
            verified_online_users = []
            for user_id in online_users:
                if redis_client.exists(f"user:{user_id}:online"):
                    verified_online_users.append(user_id)
                else:
                    # Remove user from online_users set if their individual key expired
                    redis_client.srem("online_users", user_id)
            
            return Response({
                "status": "success",
                "online_users": verified_online_users
            })

        except redis.RedisError as e:
            logger.error(f"Redis error in OnlineUsersView: {e}")
            return Response({
                "status": "error",
                "message": "Failed to fetch online users"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CheckUserStatus(APIView):
    def get(self, request, user_id):
        try:
            # Check both set membership and individual online status
            is_in_set = redis_client.sismember("online_users", str(user_id))
            has_active_status = redis_client.exists(f"user:{user_id}:online")
            
            is_online = is_in_set and has_active_status
            
            # Clean up if statuses don't match
            if is_in_set and not has_active_status:
                redis_client.srem("online_users", str(user_id))
            
            return Response({
                "status": "success",
                "user_id": user_id,
                "online": is_online
            })

        except redis.RedisError as e:
            logger.error(f"Redis error in CheckUserStatus: {e}")
            return Response({
                "status": "error",
                "message": "Failed to check user status"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    def post(self, request):
        user_id = request.COOKIES.get("user_id")
        
        if not user_id:
            return Response({
                "status": "error",
                "message": "User ID not found"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Remove user from Redis
            pipe = redis_client.pipeline()
            pipe.srem("online_users", user_id)
            pipe.delete(f"user:{user_id}:online")
            pipe.execute()
            
            # Create response that will clear the cookie
            response = Response({"status": "success"})
            response.delete_cookie('user_id')
            
            return response

        except redis.RedisError as e:
            logger.error(f"Redis error in LogoutView: {e}")
            return Response({
                "status": "error",
                "message": "Failed to logout user"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)