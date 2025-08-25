from fastapi import APIRouter
from api.v1.endpoints import marcas
from api.v1.endpoints import detalles

api_router = APIRouter()
api_router.include_router(marcas.router, prefix="")
api_router.include_router(detalles.router, prefix="")