# app/services/metrics_service.py
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from repositories.metrics_repository import MetricsRepository
from datetime import datetime, timezone

class MetricsService:
    def __init__(self, repo: MetricsRepository | None = None) -> None:
        self.repo = repo or MetricsRepository()

    def _month_bounds_utc(self) -> tuple[datetime, datetime]:
        now = datetime.now(timezone.utc)
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        # calcular primer día del siguiente mes
        if start.month == 12:
            next_month = start.replace(year=start.year + 1, month=1)
        else:
            next_month = start.replace(month=start.month + 1)
        return start, next_month

    async def get_stats_and_last3(self, db: AsyncSession) -> Dict[str, Any]:
        total = await self.repo.total_marcas(db)
        pendientes = await self.repo.count_pendientes(db)
        vencimientos = await self.repo.count_vencimientos(db)
        start_m, next_m = self._month_bounds_utc()
        aprobadas_mes = await self.repo.count_aprobadas_este_mes(db, start_month=start_m, next_month=next_m)
        ultimas = await self.repo.last_n_marcas(db, n=3)

        stats = [
            {
                "title": "Marcas Registradas",
                "value": total,
                "description": "Total de marcas registradas",
            },
            {
                "title": "Pendientes",
                "value": pendientes,
                "description": "Esperando aprobación",
            },
            {
                "title": "Vencimientos",
                "value": vencimientos,
                "description": "Próximos 30 días (definido como INACTIVAS)",
            },
            {
                "title": "Aprobadas este mes",
                "value": aprobadas_mes,
                "description": "Nuevas aprobaciones en el mes",
            },
        ]

        ultimas_3 = [
            {"id": marca.id, "titulo": marca.titulo, "nombre": marca.nombre, "estado": marca.estado}
            for marca in ultimas
        ]

        return {"stats": stats, "ultimas_registradas": ultimas_3}
