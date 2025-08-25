# backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# --- URL de Render (hardcode) ---
# Si tu instancia exige SSL, agrega ?sslmode=require al final.
ENV DATABASE_URL="postgresql://registromarca_user:8aOmaY9nqNrFFDrcSWy6rKaXlekjVb4c@dpg-d2lsq5h5pdvs73b3ed4g-a.oregon-postgres.render.com/registromarca" \
    DATABASE_URL_SYNC="postgresql://registromarca_user:8aOmaY9nqNrFFDrcSWy6rKaXlekjVb4c@dpg-d2lsq5h5pdvs73b3ed4g-a.oregon-postgres.render.com/registromarca"

WORKDIR /app

# (Opcional pero práctico) toolchain mínimo por si alguna wheel compila
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

# 1) Dependencias primero (cache)
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# 2) Código (incluye alembic.ini y carpeta alembic/)
COPY . .

# Ajusta si tu ASGI no está en main:app
ENV APP_MODULE="main:app" \
    PORT=8000

EXPOSE 8000

# 3) Arranque: migraciones + API en producción
CMD ["/bin/sh", "-lc", "\
  set -e; \
  alembic upgrade head; \
  exec gunicorn \"${APP_MODULE}\" \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers ${WORKERS:-2} \
    --worker-class uvicorn.workers.UvicornWorker \
    --timeout 60 \
"]
