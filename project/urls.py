from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('', include('_home.urls', namespace='home')),
    path('agenda/', include('_calendar.urls', namespace='calendar')),
    path('indicadores/', include('_dashboards.urls', namespace='dashboards')),
    path('ramais/', include('_ramais.urls', namespace='ramais')),
    path('links/', include('_shortener.urls', namespace='shortener')),
    path('admin/', admin.site.urls),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
