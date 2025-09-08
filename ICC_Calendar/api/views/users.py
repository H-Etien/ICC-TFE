from django.shortcuts import render
from django.contrib.auth.models import User 
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from ..model.models import Room
from ..serializers import RoomSerializer, UserSerializer

# Create your views here.
class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

def main(request):
    """
    Main view for the ICC Calendar application.
    Renders the main page of the calendar.
    """
    return HttpResponse("Welcome to the ICC Calendar")
