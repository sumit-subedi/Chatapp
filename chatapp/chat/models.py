from django.db import models
import uuid

# Create your models here.

def generate_short_user_id():
    # Generate a random UUID, take the hex representation, and return the first 4 characters
    return uuid.uuid4().hex[:4]

class AnonymousUser(models.Model):
    user_id = models.CharField(        default=generate_short_user_id, max_length= 4, editable=False, unique= True)
    created_at = models.DateTimeField(auto_now_add=True)

class ChatSession(models.Model):
    user1 = models.ForeignKey(AnonymousUser, related_name='chats_initiated', on_delete=models.CASCADE)
    user2 = models.ForeignKey(AnonymousUser, related_name='chats_received', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user1', 'user2')