import datetime

from django.db import models
from django.contrib.auth.models import User
from .tag_model import Tag

def get_default_start_time():
    now = datetime.datetime.now()
    return now.replace(hour=9, minute=0, second=0, microsecond=0)

def get_default_end_time():
    now = datetime.datetime.now()
    return now.replace(hour=23, minute=59, second=59, microsecond=0)

class Task(models.Model):
    user  = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task')
    title = models.CharField(max_length=100)
    content = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    start_time = models.DateTimeField(default=get_default_start_time)
    end_time = models.DateTimeField(default=get_default_end_time)
    
    tags = models.ManyToManyField(Tag, related_name='tasks', blank=True)

    def __str__(self):
        return self.title