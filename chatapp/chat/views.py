from django.shortcuts import render
from rest_framework.views import APIView
from django.core.cache import cache
from rest_framework.response import Response
from .models import AnonymousUser


# Create your views here.

# Receive request from user to login into the chatapp
# TODO: Check for any query like I agree on request object before creating new user and sending back id  
class AnonymousLoginView(APIView):
    def post(self, request):
        user = AnonymousUser.objects.create()
        return Response({'user_id': str(user.user_id)})
    
class OnlineUsersView(APIView):
    def get(self, request):
        # Retrieve all user IDs from the database
        all_users = AnonymousUser.objects.all()
        online_users = []

        for user in all_users:
            if cache.get(f"user_online_{user.user_id}"):
                online_users.append(str(user.user_id))

        return Response({"online_users": online_users})