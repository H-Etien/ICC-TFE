from django.db import models
import string
import random

# Fonction pour générer un code unique pour chaque salle
def generate_unique_code():
    length = 8
    characters = string.ascii_uppercase + string.digits
    code = ''.join(random.choices(characters, k=length))

    if Room.objects.filter(code=code).exists():
        return generate_unique_code()
    return code  

# Create your models here.
class Room(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=8, unique=True, default=generate_unique_code)
    description = models.TextField(blank=True, null=True)
    capacity = models.IntegerField()

    guest_can_modify = models.BooleanField(default=False, null=False)
    guest_can_invite_others = models.BooleanField(default=False, null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
