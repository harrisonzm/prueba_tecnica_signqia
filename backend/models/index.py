from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, TIMESTAMP, func
from bd.base import Base

class Marca(Base):
    __tablename__ = "marcas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    titulo: Mapped[str] = mapped_column(String(255), nullable=False)
    nombre: Mapped[str] = mapped_column(String(255), nullable=False)
    estado: Mapped[str] = mapped_column(String(20), nullable=False)
    
    
    created_at: Mapped["datetime"] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), nullable=False
    )
    approved_at: Mapped["datetime"] = mapped_column(
        TIMESTAMP(timezone=True), nullable=True
    )
