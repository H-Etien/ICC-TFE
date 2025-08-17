from django.contrib import admin
from django.urls import path, include


from .views import RoomView, CreateUserView, NoteListCreate, NoteDelete
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', RoomView.as_view()),
    path('users/register/', CreateUserView.as_view(), name="user-register"),
    path('token/', TokenObtainPairView.as_view(), name="token-obtain"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token-refresh"),
    path("api-auth/", include("rest_framework.urls")),
    
    path('notes/', NoteListCreate.as_view(), name="note-list-create"),
    path('notes/delete/<int:pk>/', NoteDelete.as_view(), name="note-delete"),
]