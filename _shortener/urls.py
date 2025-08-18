from django.urls import path
from . import views

app_name = 'shortener'

urlpatterns = [
    path('<slug:slug>/', views.redirect_link),
]
