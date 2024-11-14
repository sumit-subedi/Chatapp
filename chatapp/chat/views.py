from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import AnonymousUser

# Create your views here.

# Receive request from user to login into the chatapp
# TODO: Check for any query like I agree on request object before creating new user and sending back id  
class AnonymousLoginView(APIView):
    def post(self, request):
        user = AnonymousUser.objects.create()
        return Response({'user_id': str(user.user_id)})
    
