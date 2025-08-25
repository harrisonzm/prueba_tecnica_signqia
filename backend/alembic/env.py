# alembic/env.py
from __future__ import annotations
import pathlib, sys
from logging.config import fileConfig
from alembic import context
from sqlalchemy import create_engine, pool
from sqlalchemy.engine import Connection

# (opcional) asegurar imports del proyecto si los necesitas
BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# --- URL HARDCODEADA (SYNC/psycopg2) ---
DB_URL_SYNC = (
    "postgresql+psycopg2://registromarca_user:"
    "8aOmaY9nqNrFFDrcSWy6rKaXlekjVb4c"
    "@dpg-d2lsq5h5pdvs73b3ed4g-a.oregon-postgres.render.com:5432/"
    "registromarca?sslmode=require"
)

# Importa tu Base (ajusta la ruta a tu Base.metadata)
from bd.base import Base  # <-- ajusta si tu módulo es otro

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = DB_URL_SYNC
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    engine = create_engine(
        DB_URL_SYNC,
        poolclass=pool.NullPool,
        pool_pre_ping=True,
    )
    with engine.connect() as connection:
        do_run_migrations(connection)

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
