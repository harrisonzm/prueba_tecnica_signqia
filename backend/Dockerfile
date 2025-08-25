# backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Dependencias del sistema (mínimas). Agrega libpq-dev/gcc si usas psycopg2.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Instalar deps de Python
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiar código
# (copiamos solo lo necesario para mantener la capa pequeña)
COPY . /app

# Arranque: aplica migraciones y levanta uvicorn
# Nota: tu app está en main.py -> "main:app"
CMD alembic upgrade head && \
    uvicorn main:app --host 0.0.0.0 --port 8000
