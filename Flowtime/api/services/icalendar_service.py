from icalendar import Calendar, Event
from uuid import uuid4

# Exporter les Tasks au format iCalendar (.ics)
def export_tasks_to_ics(tasks, project_title="Tasks Export"):

    cal = Calendar()
    # cal.add('prodid', '-//Flowtime//Task Export//EN')
    cal.add('version', '2.0')
    cal.add('calscale', 'GREGORIAN')
    cal.add('method', 'PUBLISH')
    cal.add('x-wr-calname', project_title)
    cal.add('x-wr-timezone', 'UTC')
    # cal.add('x-wr-caldesc', f'Tasks export from Flowtime - {project_title}')
    
    for task in tasks:
        # Exporter uniquement les tasks qui ont start_time ET end_time
        if not task.start_time or not task.end_time:
            continue
            
        event = Event()
        
        # Identifiant unique
        event.add('uid', f'{uuid4()}-flowtime')
        
        # Titre et description
        event.add('summary', task.title)
        if task.content:
            event.add('description', task.content)
        
        # Dates
        event.add('dtstart', task.start_time)
        event.add('dtend', task.end_time)
        
        # Ajouter l'événement au calendrier
        cal.add_component(event)
    
    return cal.to_ical().decode('utf-8')

# Exporte toutes les Task d'un projet
def export_tasks_by_project(project):
    tasks = project.tasks.all()
    return export_tasks_to_ics(tasks, project_title=project.title)

