# Generated using Django 5.2.1

from pathlib import Path
from django_auth_ldap.config import LDAPSearch, ActiveDirectoryGroupType
from ldap import SCOPE_SUBTREE

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-__v#fjvwrc$73+xq@pab4e6yy5&kvj^1kg2_n+py5zx4a=gjr!'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    '_home',
    '_dashboards',
    '_ramais',
    '_calendar',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates',
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'America/Sao_Paulo'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

STATIC_URL = 'static/'

STATIC_ROOT = BASE_DIR / 'static_root'

MEDIA_URL = 'media/'

MEDIA_ROOT = BASE_DIR / 'media_root'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Redirect to login/logout
LOGIN_REDIRECT_URL = 'home:home'
LOGIN_URL = 'home:login'

# Sessions
SESSION_COOKIE_AGE = 60 * 60 * 24
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_SAVE_EVERY_REQUEST = True

# Auth LDAP
AUTHENTICATION_BACKENDS = [
    'django_auth_ldap.backend.LDAPBackend',
    'django.contrib.auth.backends.ModelBackend',
]
AUTH_LDAP_USER_SEARCH = LDAPSearch(
    "ou=Sinasc,dc=sinasc,dc=com,dc=br",
    SCOPE_SUBTREE,
    "(sAMAccountName=%(user)s)"
)
AUTH_LDAP_USER_ATTR_MAP = {
    "first_name": "givenName",
    "last_name": "sn",
    "email": "mail",
    "username": "uid",
}
AUTH_LDAP_ALWAYS_UPDATE_USER = True

AUTH_LDAP_MIRROR_GROUPS = True

AUTH_LDAP_GROUP_SEARCH = LDAPSearch(
    "ou=Grupos,ou=Sinasc,dc=sinasc,dc=com,dc=br",
    SCOPE_SUBTREE,
    "(objectClass=group)"
)
AUTH_LDAP_GROUP_TYPE = ActiveDirectoryGroupType(name_attr="cn")

AUTH_LDAP_USER_FLAGS_BY_GROUP = {
    "is_staff": "cn=GRUPO_TECNOLOGIA,ou=Grupos,ou=Sinasc,dc=sinasc,dc=com,dc=br",
}

try:
    from project.local_settings import *
except ImportError:
    ...
