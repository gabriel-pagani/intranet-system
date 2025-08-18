from django.contrib import admin
from .models import Link

@admin.register(Link)
class LinkAdmin(admin.ModelAdmin):
    list_display = ( 'slug', 'original_url', 'user','expires_at', 'access_count')
