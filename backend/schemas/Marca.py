import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field
class MarcaBase(BaseModel):
    nombre: str = Field(..., min_length=1)
    titulo: str = Field(..., min_length=1)
    estado: str = Field(..., pattern="^(ACTIVA|INACTIVA|SUSPENDIDA)$")

class MarcaCreate(MarcaBase):
    pass

class Marca(MarcaBase):
    id:int = Field(...)

    class config:
        from_attribute = True

class MarcaPatch(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1)
    titulo: Optional[str] = Field(None, min_length=1)
    estado: Optional[str] = Field(None, pattern="^(ACTIVA|INACTIVA|SUSPENDIDA)$")