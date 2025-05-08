from django.urls import path
from _home.views import home_view

app_name = 'home'

urlpatterns = [
    path('', home_view, name='home'),
]
