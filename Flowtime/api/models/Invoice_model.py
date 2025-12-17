from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal


class Invoice(models.Model):
    """
    Modèle pour stocker les factures des achats premium.
    La facture reste même si l'utilisateur est supprimé.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invoices"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('9.99'))
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(auto_now_add=True)
    premium_expires_at = models.DateTimeField()
    description = models.TextField(default="Premium Flowtime - 1 mois")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Invoice"
        verbose_name_plural = "Invoices"

    def __str__(self):
        user_name = self.user.username if self.user else "NULL"
        return f"Invoice {user_name} ({self.amount}€)"
