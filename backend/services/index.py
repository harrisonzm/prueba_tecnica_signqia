from typing import List
from sqlalchemy import select
from models.index import Marca
from sqlalchemy.orm import Session
from schemas import Marca as schemas

def create_marca(db:Session, data:schemas.MarcaCreate) -> Marca:
    with db.begin():
        marca_instance =  Marca(**data.model_dump())
        db.add(marca_instance)
    return marca_instance


def get_marcas(db:Session)-> List[tuple[Marca]] | None:
    stmt = select(Marca).order_by(Marca.id)  # all columns
    result = db.execute(stmt)
    return [tuple(row) for row in result]

def get_marca(db:Session, id:int)-> Marca | None:
    return db.get(Marca, id)

def patch_marca(db:Session, id:int, changes:schemas.MarcaPatch)-> Marca | None:
    marca_queryset = db.get(Marca, id)
    if(marca_queryset):
        for key,value in changes.model_dump().items():
            if(value): setattr(marca_queryset,key,value)
        db.commit()
        db.refresh(marca_queryset)
    return marca_queryset

def delete_marca(db:Session, id:int) -> bool:
    with db.begin():
        obj = db.get(Marca, id)
        if not obj:
            return False
        db.delete(obj)
        return True