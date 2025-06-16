from _ramais.models import Ramais
from django.http import JsonResponse
from django.shortcuts import render


def home_view(request):
    return render(request, 'ramais/main.html', {
        'is_staff': request.user.is_staff
    })


def ramais_json(request):
    dados = list(Ramais.objects.values('nome', 'ramal', 'setor', 'maquina'))
    return JsonResponse(dados, safe=False)
