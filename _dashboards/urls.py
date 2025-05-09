from django.urls import path
from _dashboards.views import home_view

app_name = 'dashboards'

urlpatterns = [
    path('', home_view, name='home'),
]
