from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from .models import Agenda
from .forms import AgendaForm
import json


@login_required
def home_view(request):
    permissions = {
        'can_add': request.user.has_perm('_calendar.add_agenda'),
        'can_change': request.user.has_perm('_calendar.change_agenda'),
        'can_delete': request.user.has_perm('_calendar.delete_agenda'),
    }
    return render(request, 'calendar/main.html', permissions)


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
                'type': reuniao.tipo.id if reuniao.tipo else None,
                'private': reuniao.privada,
            }
        })
    return JsonResponse(data, safe=False)


@login_required
@permission_required('_calendar.add_agenda', raise_exception=True)
@require_http_methods(["POST"])
def add_reuniao(request):
    try:
        data = json.loads(request.body)
        form = AgendaForm(data)
        if form.is_valid():
            reuniao = form.save()
            return JsonResponse({'status': 'success', 'id': reuniao.id})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@login_required
@permission_required('_calendar.change_agenda', raise_exception=True)
@require_http_methods(["POST"])
def update_reuniao(request, pk):
    try:
        reuniao = get_object_or_404(Agenda, pk=pk)
        data = json.loads(request.body)
        form = AgendaForm(data, instance=reuniao)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


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
