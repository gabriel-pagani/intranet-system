from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
import json
from datetime import datetime
from _calendar.models import Event


@login_required
def home_view(request):
    """Renderiza a página principal do calendário"""
    return render(request, 'calendar/main.html', {
        'can_add_event': request.user.has_perm('_calendar.add_event'),
        'can_change_event': request.user.has_perm('_calendar.change_event'),
        'can_delete_event': request.user.has_perm('_calendar.delete_event'),
    })


@login_required
def get_events(request):
    """Retorna todos os eventos no formato compatível com FullCalendar"""
    events = Event.objects.all()

    # Converter para formato do FullCalendar
    event_list = []
    for event in events:
        event_dict = {
            'id': event.id,
            'title': event.title,
            'start': event.start.isoformat(),
            'end': event.end.isoformat(),
            'allDay': event.all_day,
            'backgroundColor': event.color,
            'borderColor': event.color,
            'extendedProps': {
                'description': event.description or '',
                'creatorId': event.creator.id if event.creator else None,
            }
        }
        event_list.append(event_dict)

    return JsonResponse(event_list, safe=False)


@login_required
@permission_required('_calendar.add_event', raise_exception=True)
@csrf_exempt
@require_POST
def create_event(request):
    """Cria um novo evento"""
    try:
        data = json.loads(request.body)

        # Converter strings para objetos datetime
        start = datetime.fromisoformat(
            data.get('start').replace('Z', '+00:00'))
        end = datetime.fromisoformat(data.get('end').replace('Z', '+00:00'))

        event = Event.objects.create(
            title=data.get('title', 'Sem título'),
            description=data.get('description', ''),
            start=start,
            end=end,
            all_day=data.get('allDay', False),
            color=data.get('color', 'blue'),
            creator=request.user
        )

        # Retornar o evento criado no formato do FullCalendar
        return JsonResponse({
            'id': event.id,
            'title': event.title,
            'start': event.start.isoformat(),
            'end': event.end.isoformat(),
            'allDay': event.all_day,
            'backgroundColor': event.color,
            'borderColor': event.color,
            'extendedProps': {
                'description': event.description or '',
                'creatorId': event.creator.id if event.creator else None,
            }
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@login_required
@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def update_delete_event(request, event_id):
    """Atualiza ou deleta um evento existente"""
    event = get_object_or_404(Event, id=event_id)

    if request.method == 'DELETE':
        # Verificar permissão de exclusão
        if not request.user.has_perm('_calendar.delete_event'):
            return JsonResponse({'error': 'Permissão negada. Você não tem autorização para excluir eventos.'}, status=403)

        event.delete()
        return JsonResponse({'success': True})

    elif request.method == 'PUT':
        # Verificar permissão de edição
        if not request.user.has_perm('_calendar.change_event'):
            return JsonResponse({'error': 'Permissão negada. Você não tem autorização para modificar eventos.'}, status=403)

        try:
            data = json.loads(request.body)

            # Atualizar campos do evento
            event.title = data.get('title', event.title)
            event.description = data.get('description', event.description)

            if 'start' in data:
                event.start = datetime.fromisoformat(
                    data.get('start').replace('Z', '+00:00'))

            if 'end' in data:
                event.end = datetime.fromisoformat(
                    data.get('end').replace('Z', '+00:00'))

            event.all_day = data.get('allDay', event.all_day)
            event.color = data.get('color', event.color)

            event.save()

            # Retornar evento atualizado
            return JsonResponse({
                'id': event.id,
                'title': event.title,
                'start': event.start.isoformat(),
                'end': event.end.isoformat(),
                'allDay': event.all_day,
                'backgroundColor': event.color,
                'borderColor': event.color,
                'extendedProps': {
                    'description': event.description or '',
                    'creatorId': event.creator.id if event.creator else None,
                }
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
