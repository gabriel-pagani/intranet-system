from django.urls import path
from _calendar.views import home_view, get_events, create_event, update_delete_event

app_name = 'calendar'

urlpatterns = [
    path('', home_view, name='home'),
    path('api/events/', get_events, name='get_events'),
    path('api/events/create/', create_event, name='create_event'),
    path('api/events/<int:event_id>/',
         update_delete_event, name='update_delete_event'),
]
