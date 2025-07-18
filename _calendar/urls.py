from django.urls import path
from .views import home_view, get_reunioes, get_tipos_reuniao, add_reuniao, update_reuniao, delete_reuniao

app_name = 'calendar'

urlpatterns = [
    path('', home_view, name='home'),
    path('api/get/', get_reunioes, name='get_reunioes'),
    path('api/add/', add_reuniao, name='add_reuniao'),
    path('api/update/<int:pk>/', update_reuniao, name='update_reuniao'),
    path('api/delete/<int:pk>/', delete_reuniao, name='delete_reuniao'),
    path('api/types-meetings/', get_tipos_reuniao, name='get_tipos_reuniao'),
]
