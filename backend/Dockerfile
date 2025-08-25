# backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# 1) Instala dependencias primero para cachear
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# 2) Copia TODO el código (main.py, alembic.ini, carpeta alembic/, etc.)
COPY . .

# Ajusta si tu app no está en main:app (por ejemplo app.main:app)
ENV APP_MODULE="main:app" \
    PORT=8000

EXPOSE 8000

# 3) En el arranque del contenedor:
#    - Normaliza DATABASE_URL_SYNC para Alembic si usas +asyncpg
#    - Ejecuta alembic upgrade head
#    - Arranca en producción con Gunicorn + UvicornWorker
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
