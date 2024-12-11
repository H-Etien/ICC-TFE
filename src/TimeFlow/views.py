from datetime import datetime
from django.shortcuts import render

def index(request):
    current_datetime = datetime.now()
    return render(
        request, 
        "index.html",     
        context= {
            "test": "ok", 
            "datetime" : current_datetime
            }
        )