from models.index import Marca
from sqlalchemy.orm import Session
from schemas import Marca as schemas

def create_marca(db:Session, data:schemas.MarcaCreate):
    marca_instance =  Marca(**data.model_dump())
    db.add(marca_instance)
    db.commit()
    db.refresh(marca_instance)
    return marca_instance


def get_marcas(db:Session):
    return db.query(Marca).all()

def get_marca(db:Session, id:int):
    return db.query(Marca).filter(Marca.id==id).first()

def patch_marca(db:Session, id:int, changes:schemas.MarcaCreate):
    marca_queryset = db.query(Marca).filter(Marca.id==id).first()
    if(marca_queryset):
        for key,value in changes.model_dump():
            setattr(marca_queryset,key,value)
        db.commit()
        db.refresh(marca_queryset)
    return marca_queryset

def delete_marca(db:Session, id:int):
    marca_queryset = db.query(Marca).filter(Marca.id==id).first()
    if marca_queryset:
        db.delete(marca_queryset)
        db.commit()
    return marca_queryset