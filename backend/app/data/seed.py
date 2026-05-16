"""Seed script to populate database with initial data."""

import asyncio
import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth.service import get_password_hash
from .database import get_async_engine
from .models import User, UserRole
from .seed_data import CATEGORIES, CONTENTS, YOUTUBERS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_categories(session: AsyncSession) -> None:
    """Seed categories if they don't exist."""
    from sqlalchemy import text

    # Removed check to allow upsert

    for category in CATEGORIES:
        await session.execute(
            text("""
            INSERT INTO categories (id, name, slug)
            VALUES (:id, :name, :slug)
            ON CONFLICT (id) DO NOTHING
        """),
            category,
        )

    await session.commit()
    logger.info(f"Seeded {len(CATEGORIES)} categories")


async def seed_youtubers(session: AsyncSession) -> None:
    """Seed YouTubers if they don't exist."""
    import json

    from sqlalchemy import text

    # Removed check to allow upsert

    for youtuber in YOUTUBERS:
        data = youtuber.copy()
        data["categories"] = json.dumps(data["categories"])
        await session.execute(
            text("""
            INSERT INTO youtubers (id, name, avatar, channel_url, subscribers, description, categories, content_count)
            VALUES (:id, :name, :avatar, :channel_url, :subscribers, :description, :categories, :content_count)
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                avatar = EXCLUDED.avatar,
                channel_url = EXCLUDED.channel_url,
                subscribers = EXCLUDED.subscribers,
                description = EXCLUDED.description,
                categories = EXCLUDED.categories,
                content_count = EXCLUDED.content_count
        """),
            data,
        )

    await session.commit()
    logger.info(f"Seeded {len(YOUTUBERS)} YouTubers")


async def seed_contents(session: AsyncSession) -> None:
    """Seed contents if they don't exist."""
    import json
    from datetime import datetime

    from sqlalchemy import text

    # Removed check to allow upsert

    for content in CONTENTS:
        data = content.copy()
        data["category"] = json.dumps(data["category"])
        data["table_of_contents"] = json.dumps(data["table_of_contents"])
        data["related_contents"] = json.dumps(data["related_contents"])
        data["created_at"] = datetime.fromisoformat(data["created_at"])

        await session.execute(
            text("""
            INSERT INTO contents (
                id, title, description, thumbnail, video_url, category,
                author_name, author_avatar, duration, views, created_at,
                is_new, table_of_contents, body_content, related_contents
            ) VALUES (
                :id, :title, :description, :thumbnail, :video_url, :category,
                :author_name, :author_avatar, :duration, :views, :created_at,
                :is_new, :table_of_contents, :body_content, :related_contents
            )
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                thumbnail = EXCLUDED.thumbnail,
                video_url = EXCLUDED.video_url,
                category = EXCLUDED.category,
                author_name = EXCLUDED.author_name,
                author_avatar = EXCLUDED.author_avatar,
                duration = EXCLUDED.duration,
                created_at = EXCLUDED.created_at,
                is_new = EXCLUDED.is_new,
                table_of_contents = EXCLUDED.table_of_contents,
                body_content = EXCLUDED.body_content,
                related_contents = EXCLUDED.related_contents
        """),
            data,
        )

    await session.commit()
    logger.info(f"Seeded {len(CONTENTS)} contents")


async def seed_admin(session: AsyncSession) -> None:
    """Seed admin user if doesn't exist."""
    admin_email = "admin@example.com"
    result = await session.execute(select(User).where(User.email == admin_email))
    admin = result.scalar_one_or_none()

    if not admin:
        admin = User(
            email=admin_email,
            display_name="Administrator",
            password_hash=get_password_hash("admin1234"),  # Default password
            is_active=True,
            is_admin=True,
            role=UserRole.ADMIN,
        )
        session.add(admin)
        await session.commit()
        logger.info(f"Seeded admin user: {admin_email}")
    else:
        # Update existing admin to have ADMIN role if not set
        admin.role = UserRole.ADMIN
        admin.is_admin = True
        await session.commit()
        logger.info("Admin user already exists, updated role.")


async def seed_all() -> None:
    """Run all seed operations."""
    engine = get_async_engine()

    async with AsyncSession(engine) as session:
        try:
            await seed_categories(session)
            await seed_youtubers(session)
            await seed_contents(session)
            await seed_admin(session)
            logger.info("✅ Database seeding completed successfully!")
        except Exception as e:
            logger.error(f"❌ Seeding failed: {e}")
            await session.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(seed_all())
