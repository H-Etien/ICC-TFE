from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def main(request):
    """
    Main view for the ICC Calendar application.
    Renders the main page of the calendar.
    """
    return HttpResponse("Welcome to the ICC Calendar")
    return render(request, 'main.html')