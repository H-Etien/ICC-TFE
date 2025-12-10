from rest_framework import serializers
from ..models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        #fields = ['id', 'title', 'content', 'is_completed', 'created_at', 'updated_at', 'start_time', 'end_time', 'owner', 'time_spent', 'order', 'project', 'assigned_to', 'status']
        
        # Pour ne pas modifier ces champs via l'API
        read_only_fields = ['created_at', 'updated_at']