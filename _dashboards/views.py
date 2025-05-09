from django.shortcuts import render
from _dashboards.utils.dashboards import metabase, access
from _dashboards.models import Dashboard


def home_view(request):
    dados = dict()

    for dashboard in Dashboard.objects.all():
        setor = dashboard.setor
        dados.setdefault(setor, []).append(
            {
                'titulo': dashboard.titulo,
                'url': metabase.generate_dashboard_url(dashboard.codigo)
            }
        )

    return render(request, 'dashboards/main.html', {'dados': dados})
