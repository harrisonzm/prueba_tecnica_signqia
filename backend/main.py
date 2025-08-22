from typing import Union

from fastapi import FastAPI, Depends, HTTPException

import schemas.Marca  as schemas
from sqlalchemy.orm import Session
from bd.index import get_db, test_conection
import services.index as services
app = FastAPI()

test_conection()

@app.get("/Marcas/",response_model=list[schemas.Marca])
def get_all_marcas(db:Session = Depends(get_db)):
    return  services.get_marcas(db)

@app.get("/Marcas/{id}",response_model=list[schemas.Marca])
def get_marca_by_id(id:int, db:Session = Depends(get_db)):
    marca =  services.get_marca(db,id)
    if marca:
        return marca
    raise HTTPException(status_code=404,detail = "invalid Marca id provided")

@app.post("/Marcas/", response_model=schemas.Marca)
def create_marca(marca:schemas.MarcaCreate, db:Session = Depends(get_db)):
    return services.create_marca(db,marca)

@app.patch("/Marcas/{id}",response_model=schemas.Marca)
def patch_marca(Body:schemas.MarcaCreate, id:int, db:Session = Depends(get_db),):
    db_update = services.patch_marca(db,id,Body)
    if not db_update:
        raise HTTPException(status_code=404, detail="Marca Not Found")
    return db_update

@app.delete("/Marca/{id}",response_model=schemas.Marca)
def delete_marca(id:int, db:Session = Depends(get_db)):
    db_delete = services.delete_marca(db,id)
    if(not db_delete):
        raise HTTPException(status_code=404, detail="the ID provided is incorrect")
    return db_delete