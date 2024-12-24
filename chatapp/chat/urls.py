from django.urls import path, re_path
from .views import AnonymousLoginView, OnlineUsersView, CheckUserStatus, HeartbeatView, LogoutView
from .chatConsumer import ChatConsumer

urlpatterns = [
    path('login/', AnonymousLoginView.as_view(), name='anonymous-login'),
    path('heartbeat/', HeartbeatView.as_view(), name='heartbeat'),
    path('online-users/', OnlineUsersView.as_view(), name='online-users'),
    path('check-user/<str:user_id>/', CheckUserStatus.as_view(), name='check-user'),
    path('logout/', LogoutView.as_view(), name='logout'),
]

websocket_urlpatterns = [
    re_path(r'ws/connection/$', ChatConsumer.as_asgi()),
]