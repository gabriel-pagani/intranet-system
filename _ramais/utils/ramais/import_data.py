import json
from _ramais.models import Ramais


def import_data():
    try:
        with open('ramais.json', encoding='utf-8') as f:
            data = json.load(f)

        count = 0
        for item in data:
            Ramais.objects.create(
                nome=item.get('nome', ''),
                ramal=item.get('ramal', ''),
                setor=item.get('setor', ''),
                maquina=item.get('maquina', '')
            )
            count += 1

        print(f"Importação concluída com sucesso! {count} registros importados.")

    except Exception as e:
        print(f"Erro durante a importação: {e}")
        return 0


# ================== EXEMPLO DE USO =======================
# python manage.py shell
# from _ramais.utils.ramais.import_data import import_data
# import_data()
