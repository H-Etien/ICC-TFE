from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from ..models import Project
from ..serializers import ProjectSerializer

from ..permissions import IsProjectOwnerOrReadOnly

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
        
        # Ajouter les autres membres si fournis
        members_ids = self.request.data.get('members', [])
        if members_ids:
            for member_id in members_ids:
                try:
                    member = User.objects.get(id=member_id)
                    project.members.add(member)
                except User.DoesNotExist:
                    pass  # Ignorer si l'utilisateur n'existe pas


"""" 
Pour récupérer, mettre à jour ou supprimer un projet particulier

Hérite de RetrieveUpdateDestroyAPIView → fournit trois fonctionnalités : 
    1. Accéder à un projet particulier (via pk).
    2. Mettre à jour ses informations ou ajouter de nouveaux membres.
    3. Supprimer le projet si besoin.
"""
class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsProjectOwnerOrReadOnly]
    
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
    
    # Action pour ajouter un membre au projet
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_member(self, request, pk=None):
        project = self.get_object()
        
        # Seul le propriétaire peut ajouter des membres
        if project.owner != request.user:
            raise PermissionDenied("Seul le propriétaire peut ajouter des membres.")
        
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
            project.members.add(user)
            return Response(
                {'message': f'{email} a été ajouté au projet.'},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {'error': f'User with email {email} not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    # Action pour supprimer un membre du projet
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def remove_member(self, request, pk=None):
        project = self.get_object()
        
        # Seul le propriétaire peut supprimer des membres
        if project.owner != request.user:
            raise PermissionDenied("Seul le propriétaire peut supprimer des membres.")
        
        member_id = request.data.get('member_id')
        if not member_id:
            return Response(
                {'error': 'member_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Ne pas pouvoir supprimer le propriétaire
        if int(member_id) == project.owner.id:
            return Response(
                {'error': 'Impossible de supprimer le propriétaire du projet'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            member = User.objects.get(id=member_id)
            project.members.remove(member)
            return Response(
                {'message': f'{member.email} a été retiré du projet.'},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {'error': f'User with id {member_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )