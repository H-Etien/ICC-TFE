from django.contrib import admin

# Register your models here.
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "created_at")
    search_fields = ("title", "owner__username", "members__username")
    list_filter = ("owner",)
    ordering = ("-created_at",)