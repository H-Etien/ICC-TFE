from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics

from .models import Room
from .serializers import RoomSerializer

# Create your views here.
class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

def main(request):
    """
    Main view for the ICC Calendar application.
    Renders the main page of the calendar.
    """
    return HttpResponse("Welcome to the ICC Calendar")
    return render(request, 'main.html')