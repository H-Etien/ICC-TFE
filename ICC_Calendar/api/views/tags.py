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
        # Lie automatiquement le tag à l'utilisateur
        serializer.save(user=self.request.user)

class TagUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # L'utilisateur ne peut supprimer ou modifier que ses tags
        return Tag.objects.filter(user=self.request.user)
