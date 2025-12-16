from django.test import TestCase
from api.factories import UserFactory, ProjectFactory, TaskFactory
from django.contrib.auth.models import User


# ========== MODEL TESTS ==========

class UserFactoryTests(TestCase):

    # Créer un utilisateur 
    def test_create_user(self):
        user = UserFactory.create(username='testuser')

        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.check_password('test123456'))
        self.assertTrue(hasattr(user, 'profile'))

    # Créer plusieurs utilisateurs, minimum 5
    def test_create_batch_users(self):
        users = UserFactory.create_batch(5)

        self.assertEqual(len(users), 5)
        self.assertEqual(User.objects.filter(username__startswith='testuser').count(), 5)


class ProjectFactoryTests(TestCase):


    # Créer un projet
    def test_create_project(self):
        owner = UserFactory.create(username='owner')
        project = ProjectFactory.create(owner=owner, title='Test Project')

        self.assertEqual(project.title, 'Test Project')
        self.assertEqual(project.owner, owner)
        self.assertIn(owner, project.members.all())

    # Créer un projet avec plusieurs membres
    def test_create_project_with_members(self):
        owner = UserFactory.create()
        member1 = UserFactory.create()
        member2 = UserFactory.create()

        project = ProjectFactory.create(
            owner=owner,
            members=[member1, member2]
        )

        members = list(project.members.all())
        self.assertEqual(len(members), 3)  # owner + 2 members

    # Créer plusieurs projets
    def test_create_batch_projects(self):
        owner = UserFactory.create()
        projects = ProjectFactory.create_batch(5, owner=owner)

        self.assertEqual(len(projects), 5)


class TaskFactoryTests(TestCase):

    # Créer une tâche
    def test_create_task(self):
        project = ProjectFactory.create()
        task = TaskFactory.create(project=project, title='Implement Feature')

        self.assertEqual(task.title, 'Implement Feature')
        self.assertEqual(task.project, project)
        self.assertIsNotNone(task.start_time)
        self.assertIsNotNone(task.end_time)

    # Tester les statuts de tâche
    def test_task_status(self):
        project = ProjectFactory.create()

        for status in ['todo', 'doing', 'done']:
            task = TaskFactory.create(project=project, status=status)
            self.assertEqual(task.status, status)

    # Créer plusieurs tâches
    def test_create_batch_tasks(self):
        project = ProjectFactory.create()
        tasks = TaskFactory.create_batch(10, project=project)

        self.assertEqual(len(tasks), 10)
        self.assertEqual(project.tasks.count(), 10)

