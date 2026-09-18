"""add user role

Revision ID: add_user_role
Revises: 6f10c26c3579
Create Date: 2026-09-18
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "add_user_role"
down_revision: Union[str, Sequence[str], None] = "6f10c26c3579"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add role column to users."""
    op.add_column(
        "users",
        sa.Column(
            "role",
            sa.String(length=20),
            nullable=False,
            server_default="user",
        ),
    )

    # Existing and newly created database rows no longer need
    # a database-level default because the SQLAlchemy model
    # provides the default value.
    op.alter_column(
        "users",
        "role",
        server_default=None,
    )


def downgrade() -> None:
    """Remove role column from users."""
    op.drop_column("users", "role")