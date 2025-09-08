from django.contrib.auth.models import User
from rest_framework import serializers

from .model.models import Room 
from .model.task_model import Task, Tag

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


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]

    def create(self, validated_data):
        user = self.context["request"].user
        return Tag.objects.create(user=user, **validated_data)

 
class TaskSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)  
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Tag.objects.all(),
        source="tags"
    )

    class Meta:
        model = Task
        fields = ( "id", "author", "title", "content", "created_at", "updated_at", "start_time", "end_time", "tags", "tag_ids")
        extra_kwargs = {"author": {"read_only": True}}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Filtrer les tags disponibles par utilisateur
        user = self.context["request"].user
        self.fields["tag_ids"].queryset = Tag.objects.filter(user=user)