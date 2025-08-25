# app/api/v1/endpoints/detalles.py  (sin cambios, solo apunta al nuevo método)
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.deps import get_db
from services.metrics_service import MetricsService

router = APIRouter(tags=["detalles"])
service = MetricsService()

@router.get("/detalles")
async def get_detalles(db: AsyncSession = Depends(get_db)):
    """
    Calcula desde BD:
      - stats: registradas, pendientes (INACTIVA), vencimientos (INACTIVA), aprobadas este mes (approved_at)
      - ultimas_registradas: 3 más recientes por created_at
    """
    return await service.get_stats_and_last3(db)
