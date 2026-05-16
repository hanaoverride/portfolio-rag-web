"""유저 테이블에 avatar_url 컬럼 추가

Revision ID: fd5f9586240f
Revises: 0002
Create Date: 2025-05-02 00:00:00

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision = "fd5f9586240f"
down_revision = "0002"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "users", sa.Column("avatar_url", sa.String(length=500), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("users", "avatar_url")
