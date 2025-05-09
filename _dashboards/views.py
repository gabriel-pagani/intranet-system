from django.shortcuts import render
from _dashboards.utils.dashboards import metabase, access
from django.contrib.auth.decorators import login_required


@login_required
def home_view(request):
    dados = dict()

    for dashboard in access.get_dashboards(request.user):
        setor = dashboard.setor
        dados.setdefault(setor, []).append(
            {
                'titulo': dashboard.titulo,
                'url': metabase.generate_dashboard_url(dashboard.codigo)
            }
        )

    return render(request, 'dashboards/main.html', {'dados': dados})
