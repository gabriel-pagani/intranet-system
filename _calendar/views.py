from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from .models import Agenda


@login_required
def home_view(request):
    return render(request, 'calendar/main.html')


@login_required
def get_reunioes(request):
    reunioes = Agenda.objects.all()

    if not request.user.has_perm('_calendar.view_agenda'):
        reunioes = reunioes.filter(privada=False)

    data = []
    for reuniao in reunioes:
        data.append({
            'id': reuniao.id,
            'allDay': False,
            'start': reuniao.data_inicio.isoformat(),
            'end': reuniao.data_fim.isoformat(),
            'title': reuniao.titulo,
            'backgroundColor': reuniao.tipo.cor if reuniao.tipo else '#007bff',
            'borderColor': reuniao.tipo.cor if reuniao.tipo else '#007bff',
            'extendedProps': {
                'organizer': reuniao.organizador,
                'description': reuniao.descricao if reuniao.descricao else None,
                'type': reuniao.tipo.tipo if reuniao.tipo else None,
                'private': reuniao.privada,
            }
        })
    return JsonResponse(data, safe=False)


@login_required
@permission_required('_calendar.add_agenda', raise_exception=True)
def add_reuniao(request):
    ...


@login_required
@permission_required('_calendar.change_agenda', raise_exception=True)
def update_reuniao(request, pk):
    ...


@login_required
@permission_required('_calendar.delete_agenda', raise_exception=True)
@require_http_methods(["DELETE"])
def delete_reuniao(request, pk):
    try:
        reuniao = get_object_or_404(Agenda, pk=pk)
        reuniao.delete()
        return JsonResponse({'status': 'success'})
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
