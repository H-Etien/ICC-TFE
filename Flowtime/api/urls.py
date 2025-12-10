from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import UserCreateView, TaskListCreateView, ProjectListCreateView, ProjectDetailView, TaskDetailView



urlpatterns = [
    # User création
    path('user/register/', UserCreateView.as_view(), name='user_create'),
    
    # Project 
    path('projects/', ProjectListCreateView.as_view(), name='project_list_create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    
    # Task
    path('projects/<int:project_pk>/tasks/', TaskListCreateView.as_view(), name='project_task_list_create'),
    path('projects/<int:project_pk>/tasks/<int:pk>/', TaskDetailView.as_view(), name='project_task_detail'),
    
    # JWT Tokens pour l'authentification
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]