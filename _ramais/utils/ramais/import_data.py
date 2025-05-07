import json
from _ramais.models import Ramais

with open('data.json', encoding='utf-8') as f:
    dados = json.load(f)

for item in dados:
    Ramais.objects.create(
        nome=item.get('nome', ''),
        ramal=item.get('ramal', ''),
        setor=item.get('setor', ''),
        maquina=item.get('maquina', '')
    )

print("Importado com Sucesso!")
