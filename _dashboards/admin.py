from django.contrib import admin
from _dashboards.models import Dashboard


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'setor', 'em_dev')
    search_fields = ('titulo', 'setor')
    filter_horizontal = ('usuarios', 'grupos', 'favoritado_por')
    list_filter = ('em_dev', 'usuarios', 'grupos', 'setor')
    list_editable = ('em_dev',)
