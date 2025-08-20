from django.urls import path
from _dashboards.views import home_view, toggle_favorite

app_name = 'dashboards'

urlpatterns = [
    path('', home_view, name='home'),
    path('api/toggle-favorite/<int:dashboard_id>/', toggle_favorite, name='toggle_favorite'),
]
