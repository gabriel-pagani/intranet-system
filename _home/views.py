from django.shortcuts import render, redirect
from _home.forms import LoginForm, CustomPasswordChangeForm
from django.urls import reverse
from django.http import Http404
from django.contrib.auth import authenticate, login, update_session_auth_hash
from django.contrib import messages
from django.contrib.auth.decorators import login_required


@login_required
def home_view(request):
    return render(request, 'home/main.html')


def login_view(request):
    form = LoginForm()
    return render(request, 'home/auth/login.html', {
        'form': form,
        'form_action': reverse('home:login-done')
    })


def login_done(request):
    if not request.POST:
        raise Http404()

    form = LoginForm(request.POST)

    if form.is_valid():
        username = form.cleaned_data.get('username', '')
        password = form.cleaned_data.get('password', '')

        user = authenticate(
            username=username,
            password=password,
        )

        if user is not None:
            # Verificar se precisa trocar a senha (last_login is None)
            if user.last_login is None:
                # Armazenar o ID do usuário na sessão temporariamente
                request.session['pending_user_id'] = user.id
                return redirect(reverse('home:change-password'))
            else:
                # Login normal para usuários que já acessaram antes
                login(request, user)
                return redirect(reverse('home:home'))
        else:
            messages.error(request, 'Dados inválidos!')
    else:
        messages.error(request, 'Dados não inseridos!')

    return redirect(reverse('home:login'))


def change_password_view(request):
    # Verificar se há um usuário pendente de troca de senha
    pending_user_id = request.session.get('pending_user_id')

    # Se não houver usuário pendente e o usuário atual não estiver autenticado
    if pending_user_id is None and not request.user.is_authenticated:
        return redirect(reverse('home:login'))

    # Determinar qual usuário estamos lidando (o pendente ou o já logado)
    from django.contrib.auth import get_user_model
    User = get_user_model()

    if request.user.is_authenticated:
        # Usuário já está logado, é uma troca voluntária
        user = request.user
        is_required = False
    else:
        # Usuário ainda não está logado, é o primeiro acesso
        try:
            user = User.objects.get(id=pending_user_id)
            is_required = True
        except User.DoesNotExist:
            # Se o usuário não existir, voltar para o login
            return redirect(reverse('home:login'))

    if request.method == 'POST':
        # Se o usuário não estiver logado, usamos o ID da sessão
        if not request.user.is_authenticated:
            form = CustomPasswordChangeForm(user, request.POST)
        else:
            form = CustomPasswordChangeForm(request.user, request.POST)

        if form.is_valid():
            # Salvar a nova senha
            saved_user = form.save()

            # Se o usuário não estava logado, fazer login agora
            if not request.user.is_authenticated:
                # Fazer login com o usuário
                login(request, saved_user)
                # Limpar o ID pendente da sessão
                if 'pending_user_id' in request.session:
                    del request.session['pending_user_id']
            else:
                # Atualizar a sessão para usuários já logados
                update_session_auth_hash(request, saved_user)

            messages.success(request, 'Sua senha foi alterada com sucesso!')
            return redirect(reverse('home:home'))
        else:
            # Se o formulário for inválido, exibir mensagens de erro
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, error)
    else:
        # Se o usuário não estiver logado, usamos o ID da sessão
        if not request.user.is_authenticated:
            form = CustomPasswordChangeForm(user)
        else:
            form = CustomPasswordChangeForm(request.user)

    return render(request, 'home/auth/change_password.html', {
        'form': form,
        'is_required': is_required
    })
