from django.shortcuts import render, redirect
from _home.forms import LoginForm
from django.urls import reverse
from django.http import Http404
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.decorators import login_required


@login_required
def home_view(request):
    return render(request, 'home/main.html')


def login_view(request):
    form = LoginForm()
    return render(request, 'home/auth/login.html', {
        'form': form,
        'form_action': reverse('home:login-done')
    })


def login_done(request):
    if not request.POST:
        raise Http404()

    form = LoginForm(request.POST)

    if form.is_valid():
        authenticated = authenticate(
            username=form.cleaned_data.get('username', ''),
            password=form.cleaned_data.get('password', ''),
        )

        if authenticated is not None:
            login(request, authenticated)
            return redirect(reverse('home:home'))
        else:
            messages.error(request, 'Dados inválidos!')
    else:
        messages.error(request, 'Dados não inseridos!')

    return redirect(reverse('home:login'))
