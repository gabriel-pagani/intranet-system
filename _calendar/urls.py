from django.urls import path
from _calendar.views import home_view

app_name = 'calendar'

urlpatterns = [
    path('', home_view, name='home'),
]
