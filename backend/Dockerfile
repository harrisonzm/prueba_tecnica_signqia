FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1     PYTHONUNBUFFERED=1

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Install deps
COPY pyproject.toml README.md /app/
RUN pip install --upgrade pip && pip install ".[dev]"

# Copy source
COPY app /app
COPY alembic.ini /app/alembic.ini
COPY alembic /app/alembic

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
