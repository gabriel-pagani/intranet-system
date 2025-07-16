from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from _calendar.models import Agenda
from django.http import JsonResponse


@login_required
def home_view(request):
    return render(request, 'calendar/main.html')


@login_required
def get_reunioes(request):
    reunioes = Agenda.objects.all()
    
    if not request.user.has_perm('_calendar.view_reuniao'):
        reunioes = reunioes.filter(privada=False)

    data = []
    for reuniao in reunioes:
        data.append({
            'id': reuniao.id,
            'allDay': False,
            'start': reuniao.data_inicio.isoformat(),
            'end': reuniao.data_fim.isoformat(),
            'title': reuniao.titulo,
            'backgroundColor': reuniao.tipo.cor if reuniao.tipo else None,
            'borderColor': reuniao.tipo.cor if reuniao.tipo else None,
            'extendedProps': {
                'organizer': reuniao.organizador,
                'description': reuniao.descricao if reuniao.descricao else None,
                'type': reuniao.tipo.tipo if reuniao.tipo else None,
                'private': reuniao.privada,
            }
        })
    return JsonResponse(data, safe=False)