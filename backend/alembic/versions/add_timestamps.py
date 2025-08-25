# alembic/versions/0002_add_timestamps_to_marcas.py
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = "0002_add_timestamps_to_marcas"
down_revision = "0001_create_marca_table"
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column(
        "marcas",
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.add_column(
        "marcas",
        sa.Column(
            "approved_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),
    )
    # Opcional: índice para consultas por mes
    op.create_index("ix_marcas_approved_at", "marcas", ["approved_at"])

def downgrade() -> None:
    op.drop_index("ix_marcas_approved_at", table_name="marcas")
    op.drop_column("marcas", "approved_at")
    op.drop_column("marcas", "created_at")
