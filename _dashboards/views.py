from django.shortcuts import render, get_object_or_404
from _dashboards.utils.dashboards import metabase, access
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Dashboard


@login_required
def home_view(request):
    user = request.user
    accessible_dashboards = access.get_dashboards(user)
    
    favorites = []
    dashboards_by_sector = {}

    for dashboard in accessible_dashboards:
        dashboard_data = {
            'id': dashboard.id,
            'titulo': dashboard.titulo,
            'url': metabase.generate_dashboard_url(dashboard.codigo),
            'is_favorite': user in dashboard.favoritado_por.all()
        }
        
        if dashboard_data['is_favorite']:
            favorites.append(dashboard_data)
        
        setor = dashboard.setor
        dashboards_by_sector.setdefault(setor, []).append(dashboard_data)

    return render(request, 'dashboards/main.html', {
        'favorites': favorites,
        'dashboards_by_sector': dashboards_by_sector
    })


@login_required
@require_POST
def toggle_favorite(request, dashboard_id):
    dashboard = get_object_or_404(Dashboard, id=dashboard_id)
    user = request.user

    if user in dashboard.favoritado_por.all():
        dashboard.favoritado_por.remove(user)
        is_favorite = False
    else:
        dashboard.favoritado_por.add(user)
        is_favorite = True
        
    return JsonResponse({'status': 'success', 'is_favorite': is_favorite})