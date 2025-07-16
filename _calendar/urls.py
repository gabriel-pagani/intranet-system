from django.urls import path
from _calendar.views import home_view, get_reunioes

app_name = 'calendar'

urlpatterns = [
    path('', home_view, name='home'),
    path('api/get/', get_reunioes, name='get_reunioes'),
]
