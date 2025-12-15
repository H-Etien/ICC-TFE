from icalendar import Calendar, Event
from datetime import datetime
from django.utils import timezone
from uuid import uuid4


def export_tasks_to_ics(tasks, project_title="Tasks Export"):
    """
    Exporte les Tasks vers un format .ics (iCalendar)
    
    Args:
        tasks: QuerySet de Task ou liste de Task objects
        project_title: Titre du calendrier
    
    Returns:
        String contenant le contenu .ics
    """
    cal = Calendar()
    cal.add('prodid', '-//Flowtime//Task Export//EN')
    cal.add('version', '2.0')
    cal.add('calscale', 'GREGORIAN')
    cal.add('method', 'PUBLISH')
    cal.add('x-wr-calname', project_title)
    cal.add('x-wr-timezone', 'UTC')
    cal.add('x-wr-caldesc', f'Tasks export from Flowtime - {project_title}')
    
    for task in tasks:
        event = Event()
        
        # Identifiant unique
        event.add('uid', f'{uuid4()}@flowtime.local')
        
        # Titre et description
        event.add('summary', task.title)
        if task.content:
            event.add('description', task.content)
        
        # Dates
        if task.start_time:
            event.add('dtstart', task.start_time)
        else:
            event.add('dtstart', task.created_at)
        
        if task.end_time:
            event.add('dtend', task.end_time)
        else:
            # Par défaut, durée de 1 heure
            from datetime import timedelta
            end = task.start_time + timedelta(hours=1) if task.start_time else task.created_at + timedelta(hours=1)
            event.add('dtend', end)
        
        # Status (À faire, En cours, Terminé)
        status_map = {
            'todo': 'NEEDS-ACTION',
            'doing': 'IN-PROCESS',
            'done': 'COMPLETED'
        }
        event.add('status', status_map.get(task.status, 'NEEDS-ACTION'))
        
        # Complétude
        if task.is_completed:
            event.add('percent-complete', 100)
            event.add('completed', timezone.now())
        else:
            event.add('percent-complete', 0)
        
        # Assigné à
        if task.assigned_to:
            event.add('attendee', f'mailto:{task.assigned_to.email}', parameters={'cn': task.assigned_to.username})
        
        # Projet
        if task.project:
            event.add('categories', task.project.title)
        
        # Création et modification
        event.add('created', task.created_at)
        event.add('last-modified', task.updated_at)
        event.add('dtstamp', timezone.now())
        
        # Ajouter l'événement au calendrier
        cal.add_component(event)
    
    return cal.to_ical().decode('utf-8')


def export_tasks_by_project(project):
    """
    Exporte toutes les Tasks d'un projet spécifique vers .ics
    
    Args:
        project: Project object
    
    Returns:
        String contenant le contenu .ics
    """
    tasks = project.tasks.all()
    return export_tasks_to_ics(tasks, project_title=project.title)


def export_user_tasks(user):
    """
    Exporte toutes les Tasks assignées à un utilisateur vers .ics
    
    Args:
        user: User object
    
    Returns:
        String contenant le contenu .ics
    """
    tasks = user.assigned_tasks.all()
    return export_tasks_to_ics(tasks, project_title=f"Tasks de {user.username}")
