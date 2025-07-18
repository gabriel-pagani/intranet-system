from django.contrib import admin
from .models import TipoReuniao, Agenda

@admin.register(TipoReuniao)
class TipoReuniaoAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'cor')
    search_fields = ('tipo',)

@admin.register(Agenda)
class AgendaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo', 'data_inicio', 'data_fim', 'privada',)
    list_filter = ('tipo', 'privada', 'data_inicio')
    search_fields = ('titulo', 'descricao')
    autocomplete_fields = ('tipo',)
    date_hierarchy = 'data_inicio'
    ordering = ('data_inicio',)