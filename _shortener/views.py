from django.shortcuts import redirect, get_object_or_404
from django.http import Http404
from django.utils import timezone
from .models import Link


def redirect_link(request, slug):
    link = get_object_or_404(Link, slug=slug)
    
    if link.expires_at and link.expires_at < timezone.now():
        raise Http404("Este link expirou")
    
    link.access_count += 1
    link.save()
    return redirect(link.original_url)
