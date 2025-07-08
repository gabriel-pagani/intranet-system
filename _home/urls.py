from django.urls import path
from _home.views import home_view, login_view, login_done, logout_view

app_name = 'home'

urlpatterns = [
    path('', home_view, name='home'),
    path('login/', login_view, name='login'),
    path('login/done', login_done, name='login-done'),
    path('logout/', logout_view, name='logout'),
]
