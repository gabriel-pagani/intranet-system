from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('', include('_home.urls', namespace='home')),
    path('indicadores/', include('_dashboards.urls', namespace='dashboards')),
    path('ramais/', include('_ramais.urls', namespace='ramais')),
    path('admin/', admin.site.urls),
]
