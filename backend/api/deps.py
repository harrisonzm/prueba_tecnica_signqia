from typing import AsyncGenerator
from bd.session import get_session
from sqlalchemy.ext.asyncio import AsyncSession

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async for s in get_session():
        yield s
