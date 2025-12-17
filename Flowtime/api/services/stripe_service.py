import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_checkout_session(user, success_url, cancel_url):
    """
    Crée une session Stripe Checkout pour un abonnement Premium
    """
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': 'Flowtime Premium',
                            'description': 'Accès illimité à l\'IA et aux fonctionnalités premium',
                        },
                        'unit_amount': 999,  # 9.99€ en centimes
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',  # 'payment' pour paiement unique, 'subscription' pour abonnement
            success_url=success_url,
            cancel_url=cancel_url,
            customer_email=user.email,
            metadata={
                'user_id': user.id,
            }
        )
        return checkout_session
    except Exception as e:
        raise Exception(f"Erreur Stripe: {str(e)}")


def verify_webhook_signature(payload, sig_header):
    """
    Vérifie la signature du webhook Stripe
    """
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        return event
    except ValueError:
        raise ValueError("Payload invalide")
    except stripe.error.SignatureVerificationError:
        raise ValueError("Signature invalide")
