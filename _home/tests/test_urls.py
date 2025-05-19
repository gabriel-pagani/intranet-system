from django.test import TestCase
from django.urls import reverse


class UrlsTest(TestCase):
    def test_home_home_url_is_correct(self):
        url = reverse('home:home')
        self.assertEqual(url, '/')

    def test_home_login_url_is_correct(self):
        url = reverse('home:login')
        self.assertEqual(url, '/login/')

    def test_home_login_done_url_is_correct(self):
        url = reverse('home:login-done')
        self.assertEqual(url, '/login/done')

    def test_home_logout_url_is_correct(self):
        url = reverse('home:logout')
        self.assertEqual(url, '/logout/')

    def test_home_change_password_url_is_correct(self):
        url = reverse('home:change-password')
        self.assertEqual(url, '/change-password/')
