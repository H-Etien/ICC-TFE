from django.shortcuts import render

# Create your views here.
def index(request, *args, **kwargs):
    """
    Index view for the ICC Calendar application.
    Renders the index page of the calendar.
    """
    return render(request, 'frontend/index.html', {})