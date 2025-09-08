from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..model.tag_model import Tag
from ..serializers import TagSerializer

# Obtenir toutes les Tags
class TagListCreate(generics.ListCreateAPIView):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    # Obtenir les Tags pour chaque User
    def get_queryset(self):
        # Tags appartenant uniquement à l'utilisateur, PAS à tous les utilisateurs
        return Tag.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            # Lie automatiquement le tag à l'utilisateur
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class TagDelete(generics.DestroyAPIView):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # L'utilisateur ne peut supprimer que ses tags
        return Tag.objects.filter(user=self.request.user)
