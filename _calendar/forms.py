from django import forms
from .models import Agenda, TipoReuniao

class AgendaForm(forms.ModelForm):
    class Meta:
        model = Agenda
        fields = [
            'titulo', 'organizador', 'descricao', 'tipo',
            'data_inicio', 'data_fim', 'privada'
        ]
        widgets = {
            'titulo': forms.TextInput(attrs={'class': 'form-control'}),
            'organizador': forms.TextInput(attrs={'class': 'form-control'}),
            'descricao': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'tipo': forms.Select(attrs={'class': 'form-select'}),
            'data_inicio': forms.DateTimeInput(attrs={'type': 'datetime-local', 'class': 'form-control'}),
            'data_fim': forms.DateTimeInput(attrs={'type': 'datetime-local', 'class': 'form-control'}),
            'privada': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['tipo'].queryset = TipoReuniao.objects.all()