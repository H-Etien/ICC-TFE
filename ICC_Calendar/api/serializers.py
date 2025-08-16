from rest_framework import serializers
from .models import Room 

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'name', 'code', 'description', 'capacity', 'guest_can_modify', 'guest_can_invite_others', 'created_at', 'updated_at')