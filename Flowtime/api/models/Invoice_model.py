from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
from django.utils.translation import gettext_lazy as _


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
        related_name="invoices",
        verbose_name=_("Utilisateur")
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('9.99'), verbose_name=_("Montant"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Créée le"))
    paid_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Payée le"))
    premium_expires_at = models.DateTimeField(verbose_name=_("Expiration du premium"))
    description = models.TextField(default="Premium Flowtime - 1 mois", verbose_name=_("Description"))

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Facture")
        verbose_name_plural = _("Factures")

    def __str__(self):
        user_name = self.user.username if self.user else _("Utilisateur supprimé")
        return f"{_('Facture')} {self.id} - {user_name} ({self.amount}€)"
