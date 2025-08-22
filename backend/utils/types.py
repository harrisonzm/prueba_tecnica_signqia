from pydantic import BaseModel
class MarcaDTO(BaseModel):
    titulo:str
    nombre:str
    estado: str| None