from django.db import models


class Ramais(models.Model):
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

    nome = models.CharField(max_length=100, blank=True)
    ramal = models.CharField(max_length=4, blank=True)
    setor = models.CharField(max_length=100, blank=True, choices=SETORES)
    maquina = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f'{self.nome} - {self.ramal}'

    class Meta:
        ordering = ['nome']
        verbose_name = 'Ramal'
        verbose_name_plural = 'Ramais'
