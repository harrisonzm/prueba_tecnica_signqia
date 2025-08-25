# !/usr/bin/env bash
set -euo pipefail

# Opcional: espera a la DB (simple intento)
if [[ -n "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL detectado."
else
  echo "ADVERTENCIA: DATABASE_URL no está definido; Alembic podría fallar."
fi

echo "📦 Ejecutando migraciones Alembic..."
alembic upgrade head

echo "🚀 Iniciando FastAPI en producción (Gunicorn + UvicornWorker)..."
# Variables de tuning: WORKERS y TIMEOUT opcionales
: "${WORKERS:=2}"
: "${TIMEOUT:=60}"
: "${PORT:=8000}"

exec gunicorn \
  -k uvicorn.workers.UvicornWorker \
  --workers "${WORKERS}" \
  --timeout "${TIMEOUT}" \
  --keep-alive 75 \
  --bind "0.0.0.0:${PORT}" \
  --log-level "${LOG_LEVEL:-info}" \
  --access-logfile "-" \
  main:app
    