from django.urls import path, re_path
from .views import AnonymousLoginView
from .chatConsumer import ChatConsumer

urlpatterns = [
    path('login/', AnonymousLoginView.as_view(), name='anonymous-login'),

]

websocket_urlpatterns = [
                re_path(r'^ws/chat/(?P<user1_id>[0-9a-f]{32})/(?P<user2_id>[0-9a-f]{32})/$', ChatConsumer.as_asgi()),
]