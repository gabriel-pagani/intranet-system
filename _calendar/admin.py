from django.contrib import admin
from _calendar.models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'start', 'end', 'color', 'creator', 'created_at')
    list_filter = ('color', 'all_day', 'creator')
    search_fields = ('title', 'description')
    date_hierarchy = 'start'

    def save_model(self, request, obj, form, change):
        if not obj.creator:
            obj.creator = request.user
        super().save_model(request, obj, form, change)
