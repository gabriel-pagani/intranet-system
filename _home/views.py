from django.shortcuts import render, redirect
from _home.forms import LoginForm, CustomPasswordChangeForm
from django.urls import reverse
from django.http import Http404
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash, get_user_model
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.forms import SetPasswordForm


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
            messages.error(request, 'Dados inválidos')
    else:
        messages.error(request, 'Preencha todos os campos')

    # Retornar para o login com o formulário preenchido
    return render(request, 'home/auth/login.html', {
        'form': form,
        'form_action': reverse('home:login-done')
    })


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

            return redirect(reverse('home:home'))
        else:
            # Pegar os valores dos campos
            old_password = form.data.get('old_password', '')
            new_password1 = form.data.get('new_password1', '')
            new_password2 = form.data.get('new_password2', '')

            # Verificar campos não preenchidos
            if not old_password or not new_password1 or not new_password2:
                erro_mensagem = "Preencha todos os campos"
            # Verificar se a senha atual está correta (verificando se esse é o erro no formulário)
            elif 'A senha antiga foi digitada incorretamente. Por favor, informe-a novamente.' in str(form.errors):
                erro_mensagem = "A senha antiga está incorreta"
            # Verificar se as senhas novas coincidem
            elif new_password1 != new_password2:
                erro_mensagem = "As senhas não coincidem"
            # Verificar requisitos da senha
            elif len(new_password1) < 8 and new_password1.isdigit():
                erro_mensagem = "A nova senha deve ter pelo menos 8 caracteres e não pode ser inteiramente numérica"
            elif 'Esta senha é muito comum.' in str(form.errors):
                erro_mensagem = "A nova senha é muito comum"
            # Mensagem genérica para outros erros
            else:
                erro_mensagem = "Ocorreu um erro ao alterar sua senha. Entre em contato com os administradores da página"

            messages.error(request, erro_mensagem)
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


def logout_view(request):
    logout(request)
    return redirect('home:login')


def forgot_password_view(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        
        if not email:
            messages.error(request, 'Por favor, informe seu email')
            return render(request, 'home/auth/forgot_password.html', {'email': email})
        
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
            
            # Gerar token de reset
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Construir URL de reset
            reset_url = request.build_absolute_uri(
                reverse('home:password-reset-confirm', kwargs={'uidb64': uid, 'token': token})
            )
            
            subject = 'Redefinição de senha - Portal Grupo SMI'
            message = f'''
Olá {user.first_name or user.username},

Você solicitou a redefinição de sua senha do portal do Grupo SMI.
Clique no link abaixo para criar uma nova senha:

{reset_url}

Se você não solicitou esta redefinição, ignore este email.
'''
            
            try:
                send_mail(
                    subject,
                    message,
                    'noreply.gruposmi@gmail.com',
                    [email],
                    fail_silently=False,
                )
                messages.success(request, 'Um email com instruções será enviado para seu endereço eletrônico em alguns minutos')
                return redirect('home:login')
            except Exception as e:
                messages.error(request, 'Erro ao enviar o email. Tente novamente mais tarde')
                
        except User.DoesNotExist:
            messages.error(request, 'O email informado não consta nos registros. Entre em contato com os administradores da página')
    
    return render(request, 'home/auth/forgot_password.html')

def password_reset_confirm_view(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        User = get_user_model()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        if request.method == 'POST':
            form = SetPasswordForm(user, request.POST)
            if form.is_valid():
                form.save()
                messages.success(request, 'Sua senha foi redefinida com sucesso')
                return redirect('home:login')
            else:
                # Tratar erros do formulário
                new_password1 = form.data.get('new_password1', '')
                new_password2 = form.data.get('new_password2', '')
                
                if not new_password1 or not new_password2:
                    erro_mensagem = "Preencha todos os campos"
                elif new_password1 != new_password2:
                    erro_mensagem = "As senhas não coincidem"
                elif len(new_password1) < 8 and new_password1.isdigit():
                    erro_mensagem = "A nova senha deve ter pelo menos 8 caracteres e não pode ser inteiramente numérica"
                elif 'Esta senha é muito comum.' in str(form.errors):
                    erro_mensagem = "A nova senha é muito comum"
                else:
                    erro_mensagem = "Ocorreu um erro ao alterar sua senha. Entre em contato com os administradores da página"
                
                messages.error(request, erro_mensagem)
        else:
            form = SetPasswordForm(user)
        
        return render(request, 'home/auth/password_reset_confirm.html', {
            'form': form,
            'validlink': True
        })
    else:
        return render(request, 'home/auth/password_reset_confirm.html', {
            'validlink': False
        })