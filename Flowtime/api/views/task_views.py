from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from django.db import transaction
from django.db.models import F

from ..models import Project

from ..serializers import TaskSerializer
from ..models import Task

"""
Pour lister tous les Task dont le user est membre 
et pour en créer de nouveaux Task

Hérite de ListCreateAPIView → fournit deux fonctionnalités : 
    1. Lister tous les Task où l'utilisateur connecté est membre ou propriétaire.
    2. Créer un nouveau Task et automatiquement ajouter l’utilisateur comme membre/propriétaire.
"""

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


        # Incrémente l'ordre de toutes les tâches existantes dans le projet
        # Pour ajouter la nouvelle tâche en première position
        # Atomic pour éviter les problèmes en cas de requêtes simultanées
        with transaction.atomic():
            Task.objects.filter(project=project).update(order=F('order') + 1)
            serializer.save(project=project)


"""
Pour récupérer, mettre à jour ou supprimer un Task en particulier

Hérite de RetrieveUpdateDestroyAPIView → fournit trois fonctionnalités : 
    1. Accéder à un Task (via pk).
    2. Mettre à jour ses informations.
    3. Supprimer la Task si besoin.
"""

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    # 'pk' ici correspondra à l'ID de la tâche
    lookup_field = 'pk'

    def get_queryset(self):
        # Récupère l'ID du projet depuis l'URL
        project_pk = self.kwargs['project_pk']
        user = self.request.user

        # Retourne uniquement les tâches du projet spécifié (project_pk)
        # ET vérifie que l'utilisateur est bien membre de ce projet.
        return Task.objects.filter(project_id=project_pk, project__members=user)
