from bd.index import Base
from sqlalchemy import TIMESTAMP, Integer, Column, String

class Marca(Base):
    __tablename__ = "marca"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String,index=True)
    nombre = Column(String,index=True)
    estado = Column(String,index=True)