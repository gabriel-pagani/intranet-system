from django.urls import path
from .views import home_view, toggle_favorite, dashboard_html_view

app_name = 'dashboards'

urlpatterns = [
    path('', home_view, name='home'),
    path('api/toggle-favorite/<int:dashboard_id>/', toggle_favorite, name='toggle_favorite'),
    path('iframe/<int:dashboard_id>/', dashboard_html_view, name='dashboard_html'),
]
