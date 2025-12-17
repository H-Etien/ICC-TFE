from django.contrib import admin

# Register your models here.
from .models import Project, Task, UserProfile, Invoice

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "is_premium", "trial_ai_used", "premium_expires_at", "stripe_customer_id")
    search_fields = ("user__username", "user__email", "stripe_customer_id")
    list_filter = ("is_premium", "trial_ai_used", "premium_expires_at")
    readonly_fields = ("user", "stripe_customer_id")
    ordering = ("-premium_expires_at",)


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "amount", "created_at", "premium_expires_at")
    search_fields = ("user__username", "user__email")
    list_filter = ("created_at", "premium_expires_at")
    readonly_fields = ("created_at", "paid_at")
    ordering = ("-created_at",)


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