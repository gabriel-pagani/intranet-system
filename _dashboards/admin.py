from django.contrib import admin
from _dashboards.models import Dashboard


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'setor', 'codigo')
    filter_horizontal = ('usuarios', 'grupos')
