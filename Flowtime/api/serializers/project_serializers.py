from rest_framework import serializers

from ..models import Project
from .user_serializers import UserSerializer

class ProjectSerializer(serializers.ModelSerializer):
    # Pour avoir les détails des membres du projet
    members = UserSerializer(many=True, read_only=True)

    # Pour ajouter des membres via leurs IDs lors de la création ou mise à jour
    members_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = Project
        fields = '__all__'
        #fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'owner', 'members']
        
        read_only_fields = ['created_at', 'updated_at', 'owner', 'members']