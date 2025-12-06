from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.models import User
from ..models import Project
from ..serializers import ProjectSerializer

"""
Pour lister tous les projets dont le user est membre 
et pour en créer de nouveaux projets

Hérite de ListCreateAPIView → fournit deux fonctionnalités : 
    1. Lister tous les projets où l'utilisateur connecté est membre ou propriétaire.
    2. Créer un nouveau projet et automatiquement ajouter l’utilisateur comme membre/propriétaire.
"""
class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    # Pour ne retourner que les projets où l'utilisateur connecté est membre ou propriétaire
    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(members=user) | Project.objects.filter(owner=user)

    def perform_create(self, serializer):
        project = serializer.save(owner=self.request.user)
        project.members.add(self.request.user)  # Ajouter le créateur comme membre du projet


"""" 
Pour récupérer, mettre à jour ou supprimer un projet particulier

Hérite de RetrieveUpdateDestroyAPIView → fournit trois fonctionnalités : 
    1. Accéder à un projet particulier (via pk).
    2. Mettre à jour ses informations ou ajouter de nouveaux membres.
    3. Supprimer le projet si besoin.
"""
class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    # Pour accéder à un projet particulier par son ID
    lookup_field = 'pk'

    
    def get_queryset(self):
        user = self.request.user
        return user.projects.all()
    
    def perform_update(self, serializer):
        member_ids = serializer.validated_data.get('members_ids', None)
        project = serializer.save()
        if member_ids:
            new_members = User.objects.filter(id__in=member_ids)
            project.members.add(*new_members)
   
    # Seul le propriétaire peut supprimer le projet 
    def perform_destroy(self, instance):
        user = self.request.user
        if instance.owner != user and not user.is_staff:
            raise PermissionDenied("Seul le propriétaire peut supprimer ce projet.")
        # Sinon suppression normale (cascade sur Task si FK on_delete=CASCADE)
        instance.delete()