from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from api.models import Project, Task
from datetime import timedelta
import random


class Command(BaseCommand):
    help = "Crée des données de test: users, projects, tasks"

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            type=int,
            default=10,
            help='Nombre d\'utilisateurs à créer (défaut: 10)'
        )
        parser.add_argument(
            '--projects',
            type=int,
            default=5,
            help='Nombre de projets à créer (défaut: 5)'
        )

    def handle(self,**options):
        # Récupérer le nombre d'objets à créer
        num_users = options['users']
        num_projects = options['projects']

        self.stdout.write(self.style.SUCCESS('🚀 Création de données de test...'))

      
# -------- CRÉER LES USERS ---------
        self.stdout.write(f'👥 Création de {num_users} utilisateurs...')
        users = []
        for i in range(num_users):
            username = f"test-user{i+1}"
            email = f"test-user{i+1}@example.com"
            
            # Vérifier si l'utilisateur existe déjà
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'first_name': f'Test-{i+1}',
                    'last_name': 'Babouin'
                }
            )
            
            if created:
                user.set_password('test123456')
                user.save()
                users.append(user)
            else:
                users.append(user)

        self.stdout.write(self.style.SUCCESS(f'✅ {len(users)} utilisateurs créés/existants'))


# -------- CRÉER LES PROJECTS ---------
        self.stdout.write(f'📁 Création de {num_projects} projets...')
        projects = []
        project_titles = [
            "Créer application mobile", "Développer application web", "Refonte site vitrine", "Mise en place portail client",
            "Création dashboard admin", "Développement API interne", "Intégration paiement en ligne", "Application de réservation",
            "Application de gestion des stocks", "Application de suivi utilisateurs", "Planifier visite", "Organisation réunion mensuelle",
            "Gestion planning équipe", "Centralisation documents", "Mise en place CRM", "Migration base de données",
            "Mise à jour infrastructure serveur", "Sécurisation des accès", "Optimisation performances backend", "Refactorisation code existant",
            "Mise en place tests automatisés", "Déploiement environnement production", "Configuration pipeline CI/CD", "Lancement nouvelle fonctionnalité",
            "Analyse données utilisateurs", "Amélioration expérience utilisateur", "Création landing page", "Campagne marketing digitale",
            "Suivi KPI mensuels", "Projet pilote", "Audit technique application", "Optimisation processus internes",
            "Gestion des accès utilisateurs", "Création portail partenaires", "Développement module reporting", "Application de support client",
            "Automatisation tâches internes", "Mise en conformité sécurité", "Étude de marché", "Analyse concurrence",
            "Développement POC", "Phase de tests utilisateurs", "Correction bugs critiques", "Amélioration stabilité système",
            "Migration services cloud", "Optimisation coûts infrastructure", "Documentation technique", "Formation utilisateurs",
            "Préparation mise en production", "Suivi maintenance applicative"
        ]


        
        for i in range(num_projects):

            project_title = random.choice(project_titles)

            owner = random.choice(users)
            title = f"test - {project_title} - {i+1}"
            
            project = Project.objects.create(
                title=title,
                description=f"Description du projet {title}. C'est un projet de test pour Flowtime.",
                owner=owner,
            )
            
            project.members.add(owner)

            projects.append(project)

        self.stdout.write(self.style.SUCCESS(f'✅ {num_projects} projets créés'))

# -------- CRÉER LES TASKS ---------
        self.stdout.write(f'📝 Création de tâches aléatoires par projet...')
        task_titles = [
            "Implémenter l'authentification", "Créer la page d'accueil", "Configurer la base de données", "Ajouter les validations",
            "Tester les API", "Documenter le code", "Optimiser les performances", "Ajouter des tests unitaires",
            "Créer le design", "Déployer en production", "Corriger les bugs", "Ajouter les logs",
            "Sécuriser les endpoints", "Refactoriser le code", "Mettre à jour les dépendances", "Créer les migrations",
            "Configurer l'environnement local", "Implémenter la gestion des rôles", "Ajouter la pagination", "Optimiser les requêtes SQL",
            "Mettre en place le cache", "Configurer l'authentification JWT", "Ajouter la gestion des erreurs", "Créer les fixtures",
            "Écrire les tests d'intégration", "Mettre en place le linting", "Configurer le CI", "Mettre en place le monitoring",
            "Optimiser le temps de chargement", "Améliorer l'accessibilité", "Créer la documentation API", "Implémenter la recherche",
            "Ajouter l'export des données", "Configurer les permissions", "Mettre en place les webhooks", "Optimiser la sécurité",
            "Créer le système de notifications", "Ajouter le support multilingue", "Configurer les emails transactionnels",
            "Mettre en place les sauvegardes", "Optimiser la gestion des erreurs", "Créer le tableau de bord",
            "Implémenter les filtres avancés", "Ajouter les statistiques", "Optimiser l'UX",
            "Mettre en place le versioning API", "Créer les scripts de déploiement",
            "Nettoyer le code legacy", "Finaliser la mise en production"
        ]
        
        status = ['todo', 'doing', 'done']
        total_tasks = 0
        
        # Créer entre 1 et 10 tâches par projet aléatoirement
        for project in projects:
            num_tasks_for_project = random.randint(1, 5)  # 1 à 5 tâches par projet
            
            for task_idx in range(num_tasks_for_project):
                title = random.choice(task_titles)
                task_title = f"test - {title} - {task_idx+1}"
                status_choice = random.choice(status)
                
                start_time = timezone.now() + timedelta(days=random.randint(-30, 30))
                end_time = start_time + timedelta(hours=random.randint(1, 8))
                
                Task.objects.create(
                    title=task_title,
                    content=f"Description de la tâche: {task_title}",
                    project=project,
                    status=status_choice,
                    start_time=start_time,
                    end_time=end_time,
                    is_completed=(status_choice == 'done'),
                    time_spent=random.randint(0, 3600),
                    order=task_idx
                )
                total_tasks += 1

        # RÉSUMÉ
        self.stdout.write(self.style.SUCCESS(''))
        self.stdout.write(self.style.SUCCESS(' RÉSUMÉ:'))
        self.stdout.write(self.style.SUCCESS(f'   👥 Users: {User.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'   📁 Projects: {Project.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'   📝 Tasks: {Task.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(''))
        self.stdout.write(self.style.SUCCESS(' Données de test créées avec succès !!!'))

