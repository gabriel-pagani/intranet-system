import jwt
import time
import os
import dotenv

dotenv.load_dotenv()
token_cache = {}


def generate_dashboard_url(dashboard_id):
    current_time = time.time()
    cached = token_cache.get(dashboard_id)
    if cached and current_time < cached['exp']:
        return cached['url']  # Retorna URL existente se ainda estiver válida

    payload = {
        "resource": {"dashboard": dashboard_id},
        "params": {},
        "exp": round(time.time()) + (60 * 60)
    }

    token = jwt.encode(payload, os.getenv(
        'METABASE_SECRET_KEY'), algorithm="HS256")

    url = f"{os.getenv('METABASE_SITE_URL')}/embed/dashboard/{token}#bordered=true&titled=true"

    # Atualiza o cache
    token_cache[dashboard_id] = {
        "url": url,
        "exp": round(time.time()) + (60 * 60)
    }

    return url
