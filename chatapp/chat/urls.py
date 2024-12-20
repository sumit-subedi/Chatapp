from django.urls import path, re_path
from .views import AnonymousLoginView, OnlineUsersView, CheckUserStatus, HeartbeatView
from .chatConsumer import ChatConsumer

urlpatterns = [
    path('login/', AnonymousLoginView.as_view(), name='anonymous_login'),
    path('online-users/', OnlineUsersView.as_view(), name='online_users'),
    path('check-user/<str:user_id>/', CheckUserStatus.as_view(), name='check_user_status'),
    path('heartbeat/', HeartbeatView.as_view(), name='heartbeat'),




]

websocket_urlpatterns = [
                re_path(r'^ws/chat/(?P<user1_id>[0-9a-f]{4})/(?P<user2_id>[0-9a-f]{4})/$', ChatConsumer.as_asgi()),
]