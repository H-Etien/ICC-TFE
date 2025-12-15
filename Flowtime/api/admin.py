from django.contrib import admin

# Register your models here.
from .models import Project, Task

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "created_at")
    search_fields = ("title", "owner__username", "members__username")
    list_filter = ("owner",)
    ordering = ("-created_at",)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "project", "assigned_to", "status", "is_completed", "created_at")
    search_fields = ("title", "project__title", "assigned_to__username")
    list_filter = ("status", "is_completed", "project", "created_at")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")