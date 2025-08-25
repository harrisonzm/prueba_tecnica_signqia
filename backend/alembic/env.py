from __future__ import annotations
from logging.config import fileConfig
import pathlib
import sys
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from alembic import context
from bd.base import Base
from core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine

# Interpret the config file for Python logging.import sys, pathlib
BASE_DIR = pathlib.Path(__file__).resolve().parents[1]  # /app
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = settings.sync_database_url
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
    connectable = create_engine(settings.sync_database_url)
    with connectable.connect() as connection:
        do_run_migrations(connection)

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
