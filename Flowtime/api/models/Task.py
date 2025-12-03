from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    
    # Création et mise à jour automatiques
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Champs optionnels pour le commencement et la fin de la Task
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    
    is_completed = models.BooleanField(default=False)
    
    # related_name pour accéder aux tâches d'un utilisateur via user.tasks.all()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    
    # Temps passé en secondes sur une Task 
    time_spent = models.IntegerField(default=0) 
    
    # Numéro d'ordre de la Task pour que le user puisse les organiser
    order = models.IntegerField(default=0,db_index=True)
    

    def __str__(self):
        return self.title