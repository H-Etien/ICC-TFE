from django.db import models
from django.contrib.auth.models import User

class Tag(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tags', null=True)
    
    # Éviter les doublons de noms de tags pour un même utilisateur
    class Meta:
        unique_together = ('name', 'user')

    def __str__(self):
        return self.name