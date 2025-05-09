from _ramais.models import Ramais
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def home_view(request):
    return render(request, 'ramais/main.html')


@login_required
def ramais_json(request):
    dados = list(Ramais.objects.values('nome', 'ramal', 'setor', 'maquina'))
    return JsonResponse(dados, safe=False)
