from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DB_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/registroMarca"

engine = create_engine(SQLALCHEMY_DB_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db= SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_table():
    Base.metadata.create_all(bind=engine)

# Verificar existencia de la tabla
def table_exists(table_name: str, schema: str | None = None) -> bool:
    inspector = inspect(engine)
    return table_name in inspector.get_table_names(schema=schema)

def test_conection():
    if(not table_exists("Marcas",schema="public")):
        create_table()