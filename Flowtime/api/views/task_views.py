from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

from ..models import Project

from ..serializers import TaskSerializer
from ..models import Task

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    # Pour ne retourner que les Tasks de le user connecté
    def get_queryset(self):
        # Pour récupérer les Tasks du projet spécifié dans l'URL
        project_id = self.kwargs['project_pk']
        
        # Vérifie que le user est bien membre du projet
        project = Project.objects.get(pk=project_id)
        
        if self.request.user in project.members.all():
            return Task.objects.filter(project_id=project_id)
        
        return Task.objects.none() # Ne retourne rien si le user n'est pas membre du projet

    def perform_create(self, serializer):
        # Création de la nouvelle tâche dans le bon projet
        project_id = self.kwargs['project_pk']
        project = Project.objects.get(pk=project_id)
        serializer.save(project=project)