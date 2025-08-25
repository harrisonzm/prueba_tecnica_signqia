from typing import Optional, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from repositories.marca_repository import MarcaRepository
from schemas.Marca import MarcaCreate , MarcaPatch
from models.index import Marca

ALLOWED_ESTADOS = {"ACTIVA", "INACTIVA", "SUSPENDIDA"}

class MarcaService:
    def __init__(self, repo: MarcaRepository | None = None) -> None:
        self.repo = repo or MarcaRepository()   

    async def create_marca(self, db: AsyncSession, *, data: MarcaCreate) -> Marca:
        self._validate_estado(data.estado)
        return await self.repo.create(db, data)

    async def get_marca(self, db: AsyncSession, marca_id: int) -> Optional[Marca]:
        return await self.repo.get(db, marca_id)

    async def list_marcas(
        self, db: AsyncSession, *, search: Optional[str], estado: Optional[str], limit: int, offset: int
    ) -> Sequence[Marca]:
        if estado:
            self._validate_estado(estado)
        return await self.repo.list(db, search=search, estado=estado, limit=limit, offset=offset)

    async def update_marca(
        self,
        db: AsyncSession,
        marca_id: int,
        *,
        changes: MarcaPatch
    ) -> Optional[Marca]:
        if changes.estado:
            self._validate_estado(changes.estado)
        return await self.repo.update(db, marca_id, changes)

    async def delete_marca(self, db: AsyncSession, marca_id: int) -> bool:
        return await self.repo.delete(db, marca_id)

    def _validate_estado(self, estado: str) -> None:
        if estado not in ALLOWED_ESTADOS:
            raise ValueError(f"Estado inválido: {estado}. Permitidos: {', '.join(sorted(ALLOWED_ESTADOS))}")
