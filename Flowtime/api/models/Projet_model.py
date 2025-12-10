from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    
    # related_name pour accéder aux projets d'un utilisateur via user.owned_projects.all()
    owner = models.ForeignKey(User, related_name="owned_projects", on_delete=models.CASCADE)
    
    # related_name pour accéder aux projets d'un utilisateur via user.projects.all()
    members = models.ManyToManyField(User, related_name="projects")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    # Pour contraindre qu'un même utilisateur ne puisse pas avoir deux projets avec le même titre
    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(fields=["owner", "title"], name="unique_owner_title")
    #     ]