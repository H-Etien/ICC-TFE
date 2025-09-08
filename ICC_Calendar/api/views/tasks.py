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
        return Task.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class TaskDelete(generics.DestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # L'utilisateur ne peut supprimer que ses propres tâches
        return Task.objects.filter(author=self.request.user)

