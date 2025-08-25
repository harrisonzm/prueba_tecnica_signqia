from typing import List, Optional
from fastapi import APIRouter, Query, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db
from services.index import MarcaService
from schemas import Marca as schemas  # asumiendo Pydantic v2
# Si tienes un Enum de estado:
# from schemas.Marca import EstadoEnum

router = APIRouter(prefix="/marcas", tags=["marcas"])
service = MarcaService()


@router.get("/", response_model=List[schemas.Marca])
async def get_all_marcas(
    search: Optional[str] = Query(None, description="Búsqueda por titulo/nombre"),
    # Si tienes Enum: estado: Optional[EstadoEnum] = Query(None, description="Filtrar por estado"),
    estado: Optional[str] = Query(None, description="Filtrar por estado"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> List[schemas.Marca]:
    assert isinstance(db, AsyncSession), type(db)
    try:
        marcas = await service.list_marcas(db, search=search, estado=estado, limit=limit, offset=offset)
        # Si tus modelos Pydantic tienen from_attributes activado puedes devolver ORM directo:
        # return marcas
        return [schemas.Marca.model_validate(m) for m in marcas]
    except ValueError as e:
        # p. ej. estado inválido
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{id}", response_model=schemas.Marca)
async def get_marca_by_id(
    id: int,
    db: AsyncSession = Depends(get_db),
) -> schemas.Marca:
    try:
        marca = await service.get_marca(db, id)
        if not marca:
            raise HTTPException(status_code=404, detail="invalid Marca id provided")
        return schemas.Marca.model_validate(marca)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=schemas.Marca, status_code=status.HTTP_201_CREATED)
async def create_marca(
    marca: schemas.MarcaCreate,
    db: AsyncSession = Depends(get_db),
):
    assert isinstance(db, AsyncSession), type(db)
    try:
        created = await service.create_marca(db, data=marca)
        return schemas.Marca.model_validate(created)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{id}", response_model=schemas.Marca)
async def patch_marca(
    body: schemas.MarcaPatch,
    id: int,
    db: AsyncSession = Depends(get_db),
):
    assert isinstance(db, AsyncSession), type(db)
    try:
        db_update = await service.update_marca(db, id, changes=body)
        if not db_update:
            raise HTTPException(status_code=404, detail="Marca Not Found")
        return schemas.Marca.model_validate(db_update)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_marca(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    assert isinstance(db, AsyncSession), type(db)
    try:
        deleted = await service.delete_marca(db, id)
        if not deleted:
            raise HTTPException(status_code=404, detail="the ID provided is incorrect")
        # 204: sin body
        return
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
