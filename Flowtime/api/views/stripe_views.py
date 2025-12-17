from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import timedelta
from decimal import Decimal
import logging
import stripe
from django.conf import settings

logger = logging.getLogger(__name__)

from ..services.stripe_service import create_checkout_session, verify_webhook_signature
from ..models import UserProfile, Invoice


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        try:
            # D'abord créer la session pour obtenir le session_id
            temp_success_url = "http://localhost:5173/premium/success"
            cancel_url = "http://localhost:5173/premium"
            
            checkout_session = create_checkout_session(user, temp_success_url, cancel_url)
            
            # Maintenant on retourne le session_id au frontend
            return Response({
                'checkout_url': checkout_session.url,
                'session_id': checkout_session.id
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Erreur Stripe: {str(e)}")
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def stripe_webhook(request):
    """
    Webhook pour écouter les événements Stripe
    NOTE: Actuellement désactivé - on utilise la redirection directe vers ActivatePremiumView
    """

    return HttpResponse(status=200)


class CheckPremiumStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        try:
            profile = user.profile
            return Response({
                'is_premium': profile.is_premium,
                'expires_at': profile.premium_expires_at
            })
        except UserProfile.DoesNotExist:
            return Response({
                'is_premium': False,
                'expires_at': None
            })


class UserTrialStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retourne le statut d'essai de l'utilisateur"""
        user = request.user
        profile = user.profile
        
        return Response({
            'trial_ai_used': profile.trial_ai_used,
            'can_create_project': profile.can_create_project(),
            'can_use_ai': profile.can_use_ai(),
            'is_premium': profile.is_premium,
            'premium_expires_at': profile.premium_expires_at
        }, status=status.HTTP_200_OK)


class ActivatePremiumView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Active le premium pour l'utilisateur et crée une facture"""
        user = request.user
        
        try:
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile.is_premium = True
            premium_expires_at = timezone.now() + timedelta(days=30)
            profile.premium_expires_at = premium_expires_at
            profile.save()
            
            # Créer une facture pour cet achat
            Invoice.objects.create(
                user=user,
                amount=Decimal('9.99'),
                paid_at=timezone.now(),
                premium_expires_at=premium_expires_at,
                description="Premium Flowtime - 1 mois"
            )
            
            logger.info(f"✅ User {user.username} est maintenant Premium! Invoice créée.")
            
            return Response({
                'success': True,
                'is_premium': True,
                'expires_at': profile.premium_expires_at
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Erreur lors de l'activation du premium: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )





