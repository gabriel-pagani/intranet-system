# Descrição
Sistema empresarial intranet que tem o objetivo de centralizar o sistemas da empresa em um só lugar

# Pré-requisitos
- Python 3.9+
- Windows 10+

# Instalação
- Clone o repositório
```
git clone https://github.com/gabriel-pagani/intranet-system
```
- Entre na pasta clonada
```
cd intranet-system
```
- Crie um ambiente virtual
```
python -m venv venv
```
- Ative o ambiente virtual
```
venv\Scripts\activate
```
- Instale as dependências
```
pip install -r requirements.txt
```
- Aplique as migrações
```
python .\manage.py migrate
```
- Crie um super usuário
```
python .\manage.py createsuperuser
```

# Configuração
Na pasta intranet-system crie o arquivo ".env". Dentro do arquivo adicione o seguinte conteúdo
```
METABASE_SITE_URL = 'https://metabase.seudominio.com'
METABASE_SECRET_KEY = 'sua-chave-metabase'
```

# Estrutura do Projeto
```
intranet-system/
├── _dashboards/
├── _home/
├── _ramais/
├── project/
├── venv/
├── .env
├── .gitignore
├── db.sqlite3
├── LICENSE
├── manage.py
├── README.md
└── requirements.txt
```

# Mode de Uso
- Execulte o servidor de desenvolvimento
```
python manage.py runserver
```

# Licença 
Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](https://github.com/gabriel-pagani/intranet-system/blob/main/LICENSE) para mais detalhes. A Licença MIT é uma licença de software livre que permite o uso, cópia, modificação e distribuição do código, desde que incluída a nota de direitos autorais e a permissão original.

# Contato 
Email - gabrielpaganidesouza@gmail.com
