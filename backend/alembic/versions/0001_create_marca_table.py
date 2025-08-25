from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0001_create_marca_table"
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        "marcas",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("titulo", sa.String(length=255), nullable=False),
        sa.Column("nombre", sa.String(length=255), nullable=False),
        sa.Column("estado", sa.String(length=20), nullable=False),
    )
    op.create_index("ix_marcas_estado", "marcas", ["estado"])

def downgrade() -> None:
    op.drop_index("ix_marcas_estado", table_name="marcas")
    op.drop_table("marcas")
