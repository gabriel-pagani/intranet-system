from django.contrib import admin
from _ramais.models import Ramais


@admin.register(Ramais)
class RamaisAdmin(admin.ModelAdmin):
    list_display = ('nome', 'ramal', 'setor', 'maquina',)
    search_fields = ('nome', 'ramal', 'setor', 'maquina',)
    list_filter = ('setor',)
