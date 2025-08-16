from django.urls import path
from .views import main, RoomView

urlpatterns = [
    path('', RoomView.as_view()), 
    
]