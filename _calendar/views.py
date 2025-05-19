from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
import json
from datetime import datetime
from _calendar.models import Event


@login_required
def home_view(request):
    """Renderiza a página principal do calendário"""
    return render(request, 'calendar/main.html')


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
            }
        }
        event_list.append(event_dict)

    return JsonResponse(event_list, safe=False)


@login_required
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

    # Somente o criador ou superusuário pode modificar
    if not request.user.is_superuser and event.creator and event.creator != request.user:
        return JsonResponse({'error': 'Permissão negada'}, status=403)

    if request.method == 'DELETE':
        event.delete()
        return JsonResponse({'success': True})

    elif request.method == 'PUT':
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
                }
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
