# backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# 1) Instalar dependencias primero para aprovechar cache
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# 2) Copiar el resto del código (incluye alembic.ini y carpeta alembic/)
COPY . .

# Variables de runtime (ajústalas con tu orquestador)
ENV APP_MODULE="main:app" \
    PORT=8000

EXPOSE 8000

# 3) Al arrancar el contenedor:
#    - Normaliza la URL de DB para Alembic (si vienes de asyncpg)
#    - Ejecuta migraciones
#    - Inicia la API en producción (Gunicorn + UvicornWorker)
CMD ["/bin/sh", "-lc", "\
  set -e; \
  if [ -z \"${DATABASE_URL_SYNC}\" ] && [ -n \"${DATABASE_URL}\" ]; then \
    case \"${DATABASE_URL}\" in \
      postgresql+asyncpg://*) export DATABASE_URL_SYNC=$(printf %s \"${DATABASE_URL}\" | sed 's/+asyncpg//');; \
      *) export DATABASE_URL_SYNC=\"${DATABASE_URL}\";; \
    esac; \
  fi; \
  alembic upgrade head; \
  exec gunicorn \"${APP_MODULE}\" \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers ${WORKERS:-2} \
    --worker-class uvicorn.workers.UvicornWorker \
    --timeout 60 \
"]
