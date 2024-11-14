

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path, re_path
from chat.chatConsumer import ChatConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatapp.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            [
                re_path(r'^ws/chat/(?P<user1_id>[0-9a-f]{32})/(?P<user2_id>[0-9a-f]{32})/$', ChatConsumer.as_asgi()),
            ]
        )
    ),
})