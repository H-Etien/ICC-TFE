from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Project, Task


class Command(BaseCommand):
    help = "Supprime tous les utilisateurs de test et leurs données"

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING(' Suppression des données de test...'))
        
        # Prends que les données de test
        projects_to_delete = Project.objects.filter(title__startswith='test')
        tasks_to_delete = Task.objects.filter(title__startswith='test')
        users_to_delete = User.objects.filter(username__startswith='test-user')

        # Compte avant suppression
        projects_count = projects_to_delete.count()
        tasks_count = tasks_to_delete.count()
        users_count = users_to_delete.count()
        
        # Supprime que les données de test
        tasks_to_delete.delete()
        projects_to_delete.delete()
        users_to_delete.delete()

        self.stdout.write(self.style.SUCCESS(''))
        self.stdout.write(self.style.SUCCESS(' SUPPRIMÉ:'))
        self.stdout.write(self.style.SUCCESS(f'   👥 {users_count} utilisateurs'))
        self.stdout.write(self.style.SUCCESS(f'   📁 {projects_count} projets'))
        self.stdout.write(self.style.SUCCESS(f'   📝 {tasks_count} tâches'))
        self.stdout.write(self.style.SUCCESS(''))
        self.stdout.write(self.style.SUCCESS(' Données de test supprimées!'))
