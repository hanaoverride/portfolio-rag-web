"""Alembic environment for managing SQLAlchemy migrations."""

import logging
import os
import sys

# Add the parent directory to sys.path so we can import the 'app' package
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), "..")))
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context
from app.data import models  # noqa: F401
from app.data.database import Base
from app.main import settings

# Interpret the config file for Python logging and Alembic context.
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

logger = logging.getLogger("alembic.env")

# This is the MetaData object of your Models
target_metadata = Base.metadata


def _get_configured_url() -> str:
    """Resolve the database URL from application settings."""
    return settings.database_url


def run_migrations_offline() -> None:  # pragma: no cover - executed via Alembic CLI
    """Run migrations in 'offline' mode."""

    url = _get_configured_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:  # pragma: no cover - executed via Alembic CLI
    """Run migrations in 'online' mode."""

    configuration = config.get_section(config.config_ini_section)
    assert configuration is not None
    configuration["sqlalchemy.url"] = _get_configured_url()

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():  # pragma: no cover - executed via Alembic CLI
    run_migrations_offline()
else:
    run_migrations_online()
