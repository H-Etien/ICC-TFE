from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from ..serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q

# Create your views here.

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Permet à n'importe qui de créer un compte

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    
    def update(self, request):
        user = self.get_object()
        data = request.data
        
        # Vérifie que le nouveau username n'existe pas déjà
        if 'username' in data and data['username'] != user.username:
            if User.objects.filter(username=data['username']).exists():
                return Response(
                    {'username': ['Ce nom d\'utilisateur existe déjà.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.username = data['username']
        
        # Vérifie que le nouvel email n'existe pas déjà
        if 'email' in data and data['email'] != user.email:
            if User.objects.filter(email=data['email']).exists():
                return Response(
                    {'email': ['Cet email est déjà utilisé.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.email = data['email']
        
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        
        user.delete()
        return Response(
            {'message': 'Compte supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def UserSearchView(request):
    query = request.query_params.get('search', '')
    
    if len(query) < 2:
        return Response([], status=status.HTTP_200_OK)
    
    # Cherche les utilisateurs qui contiennent la query dans leur username
    # Exclure l'utilisateur connecté
    users = User.objects.filter(
        username__icontains=query
    ).exclude(id=request.user.id).values('id', 'username', 'email')[:10]
    
    return Response(list(users), status=status.HTTP_200_OK)