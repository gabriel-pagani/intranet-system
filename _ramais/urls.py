from django.urls import path
from _ramais.views import home_view, ramais_json

app_name = 'ramais'

urlpatterns = [
    path('', home_view, name='home'),
    path('api/', ramais_json, name='ramais_json'),
]
