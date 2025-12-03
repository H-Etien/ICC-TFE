from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

from ..serializers import TaskSerializer
from ..models import Task

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    # Pour ne retourner que les tâches de l'utilisateur connecté
    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(owner=user).order_by('order')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)