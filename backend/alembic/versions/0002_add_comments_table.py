"""댓글 테이블 추가

Revision ID: 0002
Revises: cf93e56fe31b
Create Date: 2025-11-28 00:00:00

"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision = "0002"
down_revision = "cf93e56fe31b"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "comments",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("content_id", sa.String(length=48), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("text", sa.String(length=500), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["content_id"], ["contents.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_comments_content_created",
        "comments",
        ["content_id", "created_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_comments_content_created", table_name="comments")
    op.drop_table("comments")
