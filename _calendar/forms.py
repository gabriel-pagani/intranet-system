from django import forms
from _calendar.models import Event


class EventForm(forms.ModelForm):
    """Formulário para criar e editar eventos do calendário"""

    class Meta:
        model = Event
        fields = ['title', 'description', 'start', 'end', 'all_day', 'color']
        widgets = {
            'start': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'end': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'description': forms.Textarea(attrs={'rows': 3}),
        }
