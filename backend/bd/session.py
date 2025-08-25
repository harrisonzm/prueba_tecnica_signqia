from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from core.config import settings
from typing import AsyncGenerator

engine = create_async_engine(settings.database_url, echo=False, pool_pre_ping=True,
    connect_args={"ssl": True},)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, autoflush=False)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
