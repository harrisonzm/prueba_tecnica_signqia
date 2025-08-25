from datetime import datetime, timezone
from typing import Sequence, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from models.index import Marca
from schemas import Marca as schemas

class MarcaRepository:
    async def create(self, db: AsyncSession, data: schemas.MarcaCreate) -> Marca:
        marca = Marca(**data.model_dump())
        db.add(marca)
        await db.flush()
        await db.refresh(marca)
        await db.commit()
        return marca

    async def get(self, db: AsyncSession, marca_id: int) -> Optional[Marca]:
        result = await db.execute(select(Marca).where(Marca.id == marca_id))
        return result.scalars().first()

    async def list(
        self,
        db: AsyncSession,
        search: Optional[str] = None,
        estado: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Sequence[Marca]:
        stmt = select(Marca)
        if search:
            ilike = f"%{search}%"
            stmt = stmt.where((Marca.titulo.ilike(ilike)) | (Marca.nombre.ilike(ilike)))
        if estado:
            stmt = stmt.where(Marca.estado == estado)
        stmt = stmt.order_by(Marca.id).limit(limit).offset(offset)
        res = await db.execute(stmt)
        marcas = res.scalars().all()
        return [marca for marca in marcas]

    async def update(
        self,
        db: AsyncSession,
        marca_id: int,
        changes:schemas.MarcaPatch
    ) -> Optional[Marca]:
        marca = await self.get(db, marca_id)
        if marca and changes.estado == "ACTIVA" and marca.estado != "ACTIVA" and marca.approved_at is None:
                marca.approved_at = datetime.now(timezone.utc)
        if not marca:
            return None
        for attr, value in changes.model_dump().items():
            if value is not None:
                setattr(marca, attr, value)
        await db.commit()
        await db.refresh(marca)
        return marca

    async def delete(self, db: AsyncSession, marca_id: int) -> bool:
        marca = await self.get(db, marca_id)
        if not marca:
            return False
        await db.delete(marca)
        await db.commit()
        return True
