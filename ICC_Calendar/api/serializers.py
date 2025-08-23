from django.contrib.auth.models import User
from rest_framework import serializers

from .model.models import Room 
from .model.task_model import Task

# Serializer pour convertir les objets Python en JSON
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'name', 'code', 'description', 'capacity', 'guest_can_modify', 'guest_can_invite_others', 'created_at', 'updated_at')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')
        # pour que le mot de passe soit invisible
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'author', 'title', 'content', 'created_at', 'updated_at')
        extra_kwargs = {'author': {'read_only': True}} 