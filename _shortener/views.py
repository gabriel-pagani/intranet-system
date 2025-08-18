from django.shortcuts import render, redirect, get_object_or_404
from .models import Link


def redirect_link(request, slug):
    link = get_object_or_404(Link, slug=slug)
    link.access_count += 1
    link.save()
    return redirect(link.original_url)
