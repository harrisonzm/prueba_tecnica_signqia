from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, Field
from typing import List

class Settings(BaseSettings):
    # No .env
    model_config = SettingsConfigDict(env_file=None, env_ignore_empty=True)

    APP_NAME: str = "Marca API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    BACKEND_CORS_ORIGINS: str | None = "*"

    # (no usados ya, los dejo por compatibilidad)
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "registroMarca"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    @property
    def database_url(self) -> str:
        # ASYNC (asyncpg) -> usa ssl=true (NO sslmode)
        return (
            "postgresql+asyncpg://registromarca_user:"
            "8aOmaY9nqNrFFDrcSWy6rKaXlekjVb4c"
            "@dpg-d2lsq5h5pdvs73b3ed4g-a.oregon-postgres.render.com:5432/"
            "registromarca?ssl=true"
        )

    @property
    def sync_database_url(self) -> str:
        # SYNC (psycopg2/Alembic) -> sslmode=require
        return (
            "postgresql+psycopg2://registromarca_user:"
            "8aOmaY9nqNrFFDrcSWy6rKaXlekjVb4c"
            "@dpg-d2lsq5h5pdvs73b3ed4g-a.oregon-postgres.render.com:5432/"
            "registromarca?sslmode=require"
        )

settings = Settings()
