#!/bin/sh

# aplica migrations
python manage.py migrate --noinput

# cria superusuário se não existir
echo "from django.contrib.auth.models import User;
username = '$DJANGO_SUPERUSER_USERNAME';
password = '$DJANGO_SUPERUSER_PASSWORD';
email = '$DJANGO_SUPERUSER_EMAIL';
    
print('Verificando superusuário...');
if not User.objects.filter(username=username).exists():
    print('Criando superusuário...');
    User.objects.create_superuser(username, email, password)
else:
    print('Superusuário já existe.');
" | python manage.py shell

# inicia o servidor
python manage.py runserver 0.0.0.0:8000
