from django.contrib import admin
from django.urls import path, include


from .views import RoomView, CreateUserView, TaskListCreate, TaskUpdateDelete, TagListCreate, TagUpdateDelete
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Route API 
urlpatterns = [
    path('', RoomView.as_view()),
    path('user/register/', CreateUserView.as_view(), name="user-register"),
    path('token/', TokenObtainPairView.as_view(), name="token-obtain"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token-refresh"),
    path("api-auth/", include("rest_framework.urls")),

    # Tasks, ajout, modification, suppression
    path('tasks/', TaskListCreate.as_view(), name="task-list-create"),
    path('tasks/<int:pk>/', TaskUpdateDelete.as_view(), name="task-update-delete"),

    # Tags, ajout, modification, suppression
    path('tags/', TagListCreate.as_view(), name="tag-list-create"),
    path('tags/<int:pk>/', TagUpdateDelete.as_view(), name="tag-update-delete"),
]