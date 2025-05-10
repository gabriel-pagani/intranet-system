from django import forms
from django.contrib.auth.forms import PasswordChangeForm


class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(
        widget=forms.PasswordInput()
    )


class CustomPasswordChangeForm(PasswordChangeForm):
    old_password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Senha atual'}),
        label="Senha atual"
    )
    new_password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Nova senha'}),
        label="Nova senha"
    )
    new_password2 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={'placeholder': 'Confirme a nova senha'}),
        label="Confirmação da nova senha"
    )
