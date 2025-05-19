from django.test import TestCase
from django.urls import reverse, resolve
from _home import views


class ViewsTest(TestCase):
    def test_home_home_view_function_is_correct(self):
        view = resolve(reverse('home:home'))
        self.assertIs(view.func, views.home_view)

    def test_home_login_view_function_is_correct(self):
        view = resolve(reverse('home:login'))
        self.assertIs(view.func, views.login_view)

    def test_home_login_done_view_function_is_correct(self):
        view = resolve(reverse('home:login-done'))
        self.assertIs(view.func, views.login_done)

    def test_home_change_password_view_function_is_correct(self):
        view = resolve(reverse('home:change-password'))
        self.assertIs(view.func, views.change_password_view)

    def test_home_logout_view_function_is_correct(self):
        view = resolve(reverse('home:logout'))
        self.assertIs(view.func, views.logout_view)
