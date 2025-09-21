from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..model.task_model import Task
from ..model.tag_model import Tag
from ..serializers import TaskSerializer, TagSerializer

# Obtenir toutes les Tasks
class TaskListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    # Obtenir les Tasks pour chaque User
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Supprimer, modifier une Task
class TaskUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)
    
    # Pour debug avec les données reçues
    def perform_update(self, serializer):
        data = getattr(self.request, "data", None)
        print('\n', "perform_update request.data:", data, '\n')
        serializer.save()
        
