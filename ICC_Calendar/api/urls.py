from django.contrib import admin
from django.urls import path, include


from .views import RoomView, CreateUserView, TaskListCreate, TaskDelete, TagListCreate, TagDelete
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', RoomView.as_view()),
    path('user/register/', CreateUserView.as_view(), name="user-register"),
    path('token/', TokenObtainPairView.as_view(), name="token-obtain"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token-refresh"),
    path("api-auth/", include("rest_framework.urls")),

    path('task/', TaskListCreate.as_view(), name="task-list-create"),
    path('task/delete/<int:pk>/', TaskDelete.as_view(), name="task-delete"),

    path('tags/', TagListCreate.as_view(), name="tag-list-create"),
    path('tags/<int:pk>/', TagDelete.as_view(), name="tag-delete"),
]