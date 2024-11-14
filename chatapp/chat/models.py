from django.db import models
import uuid

# Create your models here.

class AnonymousUser(models.Model):
    user_id = models.UUIDField(default=lambda: uuid.uuid4().hex, editable=False, unique= True)
    created_at = models.DateTimeField(auto_now_add=True)

class ChatSession(models.Model):
    user1 = models.ForeignKey(AnonymousUser, related_name='chats_initiated', on_delete=models.CASCADE)
    user2 = models.ForeignKey(AnonymousUser, related_name='chats_received', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user1', 'user2')