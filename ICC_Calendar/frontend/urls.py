from django.urls import path
from .views import index

urlpatterns = [
    path('', index, name='index'),  # Main index view for the frontend
]
