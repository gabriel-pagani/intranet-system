from django.db import models
from django.contrib.auth.models import User, Group


class Dashboard(models.Model):
    SETORES = [
        ('Almoxarifado', 'Almoxarifado'),
        ('Comercial', 'Comercial'),
        ('Controle', 'Controle'),
        ('Compras', 'Compras'),
        ('Contabilidade', 'Contabilidade'),
        ('Custos', 'Custos'),
        ('Diretoria', 'Diretoria'),
        ('Engenharia', 'Engenharia'),
        ('Financeiro', 'Financeiro'),
        ('Fiscal', 'Fiscal'),
        ('Gestão de Pessoas', 'Gestão de Pessoas'),
        ('Gestão Industrial', 'Gestão Industrial'),
        ('Industria de Apontamento', 'Industria de Apontamento'),
        ('Industria de Eletrônicos', 'Industria de Eletrônicos'),
        ('Industria de Esferas', 'Industria de Esferas'),
        ('Industria Metalúrgica', 'Industria Metalúrgica'),
        ('Industria de Placas', 'Industria de Placas'),
        ('Industria de Tachas', 'Industria de Tachas'),
        ('Industria de Tintas', 'Industria de Tintas'),
        ('Jurídico', 'Jurídico'),
        ('Licitação', 'Licitação'),
        ('Logística', 'Logística'),
        ('Manutenção', 'Manutenção'),
        ('Marketing', 'Marketing'),
        ('Monitoramentos', 'Monitoramentos'),
        ('Obras', 'Obras'),
        ('Projetos', 'Projetos'),
        ('Qualidade', 'Qualidade'),
        ('Recebimentos', 'Recebimentos'),
        ('Recursos Humanos', 'Recursos Humanos'),
        ('Secretaria', 'Secretaria'),
        ('Segurança do Trabalho', 'Segurança do Trabalho'),
        ('Tecnologia', 'Tecnologia'),
        ('Trânsito', 'Trânsito'),
    ]

    titulo = models.CharField(max_length=100)
    setor = models.CharField(max_length=100, choices=SETORES)
    codigo = models.IntegerField()
    usuarios = models.ManyToManyField(
        User, related_name='dashboards', blank=True)
    grupos = models.ManyToManyField(
        Group, related_name='dashboards', blank=True)
    favoritado_por = models.ManyToManyField(
        User, related_name='favorite_dashboards', blank=True, verbose_name="Favoritado por")

    def __str__(self) -> str:
        return self.titulo

    class Meta:
        ordering = ['setor', 'titulo']
        permissions = [
            ("view_all_dashboards", "Can view all dashboards"),
        ]
