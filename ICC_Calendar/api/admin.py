from django.contrib import admin
from .model.task_model import Task
from .model.tag_model import Tag  

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "user")
    search_fields = ("name",)
    list_filter = ("user",)

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "user", "is_completed", "start_time", "end_time", "created_at", "updated_at", "tags_list")
    list_filter = ("is_completed", "user")
    search_fields = ("title", "content")
    readonly_fields = ("created_at", "updated_at")
    filter_horizontal = ("tags",)  
    ordering = ("-start_time",)

    # Avoir la liste des tags lié à une Task
    def tags_list(self, obj):
        return ", ".join([t.name for t in obj.tags.all()])
    tags_list.short_description = "Tags"