# backend/Dockerfile
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Paquetes mínimos (build-essential por si alguna wheel compila)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl \
 && rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python primero para cachear
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiar código (incluye alembic.ini y carpeta alembic/)
COPY . /app

# Crear usuario no root
RUN useradd -m -u 10001 appuser && chown -R appuser:appuser /app
USER appuser

# Variables típicas de runtime (ajústalas en tu entorno/compose)
ENV ENVIRONMENT=production \
    LOG_LEVEL=INFO \
    PORT=8000
# Si usas SQLAlchemy async con asyncpg en la app, define DATABASE_URL así:
# DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname

# Alembic suele requerir driver sync en migraciones. En tu env.py,
# reemplaza +asyncpg por cadena vacía para migrar (ver nota abajo).
# Alternativa: exporta también DATABASE_URL_SYNC sin +asyncpg y léelo en env.py.

# Copiamos entrypoint y lo marcamos ejecutable
COPY /entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
