from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

EstadoLiteral = Literal["ACTIVA", "INACTIVA", "SUSPENDIDA"]

class MarcaBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=255)
    titulo: str = Field(..., min_length=1, max_length=255)
    estado: EstadoLiteral

class MarcaCreate(MarcaBase):
    pass

class Marca(MarcaBase):
    id: int
    # Pydantic v2: activar lectura por atributos (ORM)
    model_config = ConfigDict(from_attributes=True)

class MarcaPatch(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1, max_length=255)
    titulo: Optional[str] = Field(None, min_length=1, max_length=255)
    estado: Optional[EstadoLiteral] = None
