from __future__ import annotations

from app.data.models import User


def test_user_has_avatar_url_field():
    assert hasattr(User, "avatar_url"), "User model should have avatar_url field"


def test_user_avatar_url_is_nullable():
    from sqlalchemy import inspect

    mapper = inspect(User)
    avatar_url_column = mapper.columns.get("avatar_url")
    assert avatar_url_column is not None, "avatar_url column should exist"
    assert avatar_url_column.nullable is True, "avatar_url should be nullable"
