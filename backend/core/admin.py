from django.contrib import admin
from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "account", "created_at")
    list_filter = ("account",)
    search_fields = ("name", "email")