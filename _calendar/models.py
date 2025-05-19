from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class Event(models.Model):
    """Modelo para armazenar eventos do calendário"""
    title = models.CharField(_('Título'), max_length=200)
    description = models.TextField(_('Descrição'), blank=True, null=True)
    start = models.DateTimeField(_('Início'))
    end = models.DateTimeField(_('Fim'))
    all_day = models.BooleanField(_('Dia inteiro'), default=False)

    # Cores para eventos
    COLORS = (
        ('blue', _('Azul')),
        ('green', _('Verde')),
        ('red', _('Vermelho')),
        ('orange', _('Laranja')),
        ('purple', _('Roxo')),
    )
    color = models.CharField(_('Cor'), max_length=20,
                             choices=COLORS, default='blue')

    # Relação opcional com usuário
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='events',
        verbose_name=_('Criador'),
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _('Evento')
        verbose_name_plural = _('Eventos')
        ordering = ['start']
