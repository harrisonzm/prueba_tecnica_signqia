from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import orjson

from core.config import settings
from api.v1.routers import api_router

def orjson_dumps(v, *, default):
    return orjson.dumps(v, default=default).decode()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
origins = ["*"] if settings.BACKEND_CORS_ORIGINS in (None, "", "*") else [
    o.strip() for o in settings.BACKEND_CORS_ORIGINS.split(",")
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

# Routers
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Startup/Shutdown logs
@app.on_event("startup")
async def on_startup():
    logger.info("Starting application...")

@app.on_event("shutdown")
async def on_shutdown():
    logger.info("Shutting down application...")