# app/repositories/metrics_repository.py
from typing import List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_
from models.index import Marca
from datetime import datetime, timezone

class MetricsRepository:
    async def total_marcas(self, db: AsyncSession) -> int:
        res = await db.execute(select(func.count(Marca.id)))
        return int(res.scalar_one())

    async def count_pendientes(self, db: AsyncSession) -> int:
        # Pendientes = INACTIVA (ajusta si tu negocio usa otro estado)
        res = await db.execute(select(func.count(Marca.id)).where(Marca.estado == "INACTIVA"))
        return int(res.scalar_one())

    async def count_vencimientos(self, db: AsyncSession) -> int:
        # Vencimientos = INACTIVA (según tu requerimiento)
        return await self.count_pendientes(db)

    async def count_aprobadas_este_mes(self, db: AsyncSession, *, start_month: datetime, next_month: datetime) -> int:
        res = await db.execute(
            select(func.count(Marca.id)).where(
                and_(
                    Marca.estado == "ACTIVA",
                    Marca.approved_at.is_not(None),
                    Marca.approved_at >= start_month,
                    Marca.approved_at < next_month,
                )
            )
        )
        return int(res.scalar_one())

    async def last_n_marcas(self, db: AsyncSession, n: int = 3) -> List[Marca]:
        # Usar created_at si existe; fallback a id
        stmt = (
            select(Marca)
            .order_by(desc(Marca.created_at), desc(Marca.id))
            .limit(n)
        )
        res = await db.execute(stmt)
        res = res.scalars().all()
        return [marca for marca in res]
