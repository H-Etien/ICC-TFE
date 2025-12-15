from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from ..serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

# Create your views here.

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Permet à n'importe qui de créer un compte

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user