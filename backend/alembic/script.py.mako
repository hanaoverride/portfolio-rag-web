"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision}
Create Date: ${create_date}

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from alembic import context

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade():
    schema_upgrades()
    if context.get_x_argument(as_dictionary=True).get("data"):
        data_upgrades()


def downgrade():
    if context.get_x_argument(as_dictionary=True).get("data"):
        data_downgrades()
    schema_downgrades()


def schema_upgrades():
    """schema upgrade migrations go here."""
    ${upgrades if upgrades else "pass"}


def schema_downgrades():
    """schema downgrade migrations go here."""
    ${downgrades if downgrades else "pass"}


def data_upgrades():
    """Add optional data upgrade migrations here."""
    pass


def data_downgrades():
    """Add optional data downgrade migrations here."""
    pass