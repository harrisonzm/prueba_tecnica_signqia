import datetime
from pydantic import BaseModel
class MarcaBase(BaseModel):
    titulo:str
    nombre:str
    created_at:datetime.datetime | None = None
    update_at:datetime.datetime | None = None

class MarcaCreate(MarcaBase):
    pass

class Marca(MarcaBase):
    id:int

    class config:
        from_attribute = True