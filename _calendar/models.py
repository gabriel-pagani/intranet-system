from django.db import models
from django.core.exceptions import ValidationError
from re import match

class TipoReuniao(models.Model):
    tipo = models.CharField(max_length=100, unique=True, verbose_name="Tipo da Reunião")
    cor = models.CharField(max_length=7, default="#007bff", verbose_name="Cor em Hexadecimal")

    def clean(self):
        super().clean()
        if self.cor:
            if len(self.cor) != 7:
                raise ValidationError({'cor': 'A cor deve ter exatamente 7 caracteres.'})
            
            if not match(r'^#[0-9A-Fa-f]{6}$', self.cor):
                raise ValidationError({'cor': 'A cor deve estar no formato hexadecimal (#RRGGBB).'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.tipo
    
    class Meta:
        verbose_name = "tipo de reunião"
        verbose_name_plural = "tipos de reunião"
        ordering = ['tipo']

class Agenda(models.Model):
    titulo = models.CharField(max_length=200, verbose_name="Título")
    organizador = models.CharField(max_length=200, verbose_name="Organizador")
    descricao = models.TextField(blank=True, null=True, verbose_name="Descrição")
    tipo = models.ForeignKey(TipoReuniao, on_delete=models.SET_NULL, null=True, verbose_name="Tipo de Reunião")
    data_inicio = models.DateTimeField(verbose_name="Data e Hora de Início")
    data_fim = models.DateTimeField(verbose_name="Data e Hora de Fim")   
    privada = models.BooleanField(default=False, verbose_name="Reunião Privada?")

    def __str__(self):
        return f"{self.titulo} - {self.data_inicio.strftime('%d/%m/%Y %H:%M')}"

    def clean(self):
        if self.data_inicio and self.data_fim:
            if self.data_fim <= self.data_inicio:
                raise ValidationError("A data e hora de fim devem ser posteriores à data e hora de início.")

            conflitos = Agenda.objects.filter(
                data_inicio__lt=self.data_fim,
                data_fim__gt=self.data_inicio
            ).exclude(pk=self.pk)

            if conflitos.exists():
                raise ValidationError("Já existe uma reunião agendada para este horário.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Reunião"
        verbose_name_plural = "Reuniões"
        ordering = ['data_inicio']