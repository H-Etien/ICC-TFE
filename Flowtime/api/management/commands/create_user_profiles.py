from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile


class Command(BaseCommand):
    help = 'Crée les UserProfile pour tous les utilisateurs existants qui n\'en ont pas'

    def handle(self, *args, **options):
        users = User.objects.all()
        created_count = 0

        for user in users:
            profile, created = UserProfile.objects.get_or_create(user=user)
            if created:
                created_count += 1
                self.stdout.write(f"✅ Profil créé pour {user.username}")
            else:
                self.stdout.write(f"⏭️  Profil existant pour {user.username}")

        self.stdout.write(
            self.style.SUCCESS(f'\n✅ Commande terminée! {created_count} profil(s) créé(s).')
        )
