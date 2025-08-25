# backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Necesario para compilar psycopg2: gcc + libpq-dev (trae pg_config)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

ENV APP_MODULE="main:app" \
    PORT=8000 \
    DATABASE_URL="postgresql://registromarca_user:8aOmaY9nqNrFFDrcSWy6rKaXlekjVb4c@dpg-d2lsq5h5pdvs73b3ed4g-a.oregon-postgres.render.com/registromarca?sslmode=require" \
    DATABASE_URL_SYNC="postgresql://registromarca_user:8aOmaY9nqNrFFDrcSWy6rKaXlekjVb4c@dpg-d2lsq5h5pdvs73b3ed4g-a.oregon-postgres.render.com/registromarca?sslmode=require"

EXPOSE 8000

CMD ["/bin/sh", "-lc", "\
  set -e; \
  alembic upgrade head; \
  exec gunicorn \"${APP_MODULE}\" \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers ${WORKERS:-2} \
    --worker-class uvicorn.workers.UvicornWorker \
    --timeout 60 \
"]
