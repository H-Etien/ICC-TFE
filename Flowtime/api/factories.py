from django.contrib.auth.models import User
from api.models import Project, Task
from faker import Faker
from datetime import datetime, timedelta
import random

fake = Faker()
counter = 0


class UserFactory:
    counter = 0
    
    # Créer un utilisateur
    @staticmethod
    def create(username=None, email=None):
        
        UserFactory.counter += 1
        
        if not username:
            username = f'testuser{UserFactory.counter}'
        if not email:
            email = fake.email()
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password='test123456',
            first_name=fake.first_name(),
            last_name=fake.last_name()
        )
        
        return user
    
    @staticmethod
    def create_batch(count):
        #Créer plusieurs utilisateurs
        return [UserFactory.create() for _ in range(count)]


class ProjectFactory:

    # Créer un projet
    @staticmethod
    def create(owner=None, title=None, description=None, members=None):
        
        if not owner:
            owner = UserFactory.create()
        if not title:
            title = f"test-{fake.catch_phrase()}" 
        if not description:
            description = fake.text(max_nb_chars=200)
        
        project = Project.objects.create(
            title=title,
            description=description,
            owner=owner
        )
        
        # Ajouter le owner comme membre
        project.members.add(owner)
        
        # Ajouter les autres membres
        if members:
            for member in members:
                project.members.add(member)
        
        return project
    
    # Créer plusieurs projets
    @staticmethod
    def create_batch(count, owner=None):
        if not owner:
            owner = UserFactory.create()
        
        return [ProjectFactory.create(owner=owner) for _ in range(count)]


class TaskFactory:
    
    # Créer une tâche
    @staticmethod
    def create(project=None, title=None, status=None, assigned_to=None):
        
        if not project:
            project = ProjectFactory.create()
        if not title:
              title = f"test-{fake.sentence(nb_words=5)}" 
        if not status:
            status = random.choice(['todo', 'doing', 'done'])
        
        # Créer les dates
        start_time = datetime.now() + timedelta(days=random.randint(-30, 30))
        end_time = start_time + timedelta(hours=random.randint(1, 8))
        
        task = Task.objects.create(
            title=title,
            content=fake.text(max_nb_chars=300),
            project=project,
            status=status,
            start_time=start_time,
            end_time=end_time,
            is_completed=(status == 'done'),
            time_spent=random.randint(0, 28800)
        )
        
        # Assigner à un membre si fourni
        if assigned_to:
            task.assigned_to = assigned_to
            task.save()
        elif project.members.exists():
            # Assigner à un membre aléatoire du projet
            task.assigned_to = random.choice(list(project.members.all()))
            task.save()
        
        return task
    
    # Créer plusieurs tâches
    @staticmethod
    def create_batch(count, project=None):
        if not project:
            project = ProjectFactory.create()
        
        return [TaskFactory.create(project=project) for _ in range(count)]
