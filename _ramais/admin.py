from django.contrib import admin
from _ramais.models import Ramais


@admin.register(Ramais)
class RamaisAdmin(admin.ModelAdmin):
    list_display = ('nome', 'ramal', 'setor', 'maquina')
    search_fields = ('nome', 'setor')
    list_filter = ('setor',)
