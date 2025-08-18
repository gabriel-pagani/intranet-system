from django.db import models
from django.contrib.auth.models import User
import string
import random
from django.utils import timezone
from datetime import timedelta


def generate_slug():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=10))


class Link(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='links')
    original_url = models.URLField()
    slug = models.SlugField(unique=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    access_count = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_slug()
        if not self.expires_at:
            if not self.user.has_perm('_shortener.link_without_expiration'):
                self.expires_at = timezone.now() + timedelta(days=30)
        super().save(*args, **kwargs)

    def is_expired(self):
        return self.expires_at and timezone.now() > self.expires_at

    def __str__(self):
        return f"{self.slug} -> {self.original_url}"

    class Meta:
        permissions = [
            ("link_without_expiration", "Link without expiration"),
            ("can_change_the_slug", "Can change the slug"),
            ("can_view_access_count", "Can view access count"),
        ]