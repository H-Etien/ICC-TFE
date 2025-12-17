from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

# Étendre le modèle User avec un profil
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_premium = models.BooleanField(default=False)
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    premium_expires_at = models.DateTimeField(blank=True, null=True)
    
    # Essai IA : permet d'utiliser l'IA 1 fois gratuitement
    trial_ai_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - Premium: {self.is_premium}"

    def can_use_ai(self):
        """
        Vérifie si l'utilisateur peut utiliser l'IA :
        - Premium : oui, illimité
        - Essai IA non utilisé : oui, 1 seul
        - Essai IA utilisé : non
        """
        if self.is_premium and self.premium_expires_at:
            if self.premium_expires_at > timezone.now():
                return True
        if not self.trial_ai_used:
            return True
        return False

    def can_create_project(self):
        """
        Vérifie si l'utilisateur peut créer un projet :
        - Tout le monde peut créer un projet (illimité)
        """
        return True
