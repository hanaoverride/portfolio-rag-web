"""Application configuration using environment variables."""

from functools import lru_cache
from pathlib import Path
from typing import Any, List, Optional

from pydantic import AliasChoices, Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
_ENV_FILE = _PROJECT_ROOT / ".env"
_DEFAULT_DATABASE_URL = (
    "postgresql+psycopg://postgres:postgres@localhost:5432/portfolio"
)


class Settings(BaseSettings):
    """Runtime configuration loaded from the environment."""

    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    environment: str = Field(default="local", pattern=r"^[a-z0-9_-]{2,20}$")
    service_name: str = Field(default="portfolio-backend", min_length=1, max_length=50)
    api_prefix: str = Field(default="/api/v1", pattern=r"^/[a-z0-9/._-]+$")

    database_url: str = Field(
        default=_DEFAULT_DATABASE_URL,
        min_length=10,
        validation_alias=AliasChoices("DATABASE_URL", "DB_URL"),
    )

    jwt_secret_key: SecretStr = Field(
        default=SecretStr("change-me-in-prod"),
        min_length=12,
        validation_alias=AliasChoices("JWT_SECRET", "JWT_SECRET_KEY"),
    )
    jwt_algorithm: str = Field(default="HS256", min_length=4, max_length=10)
    jwt_access_token_exp_minutes: int = Field(default=60, ge=5, le=1440)

    allowed_origins: Any = Field(default_factory=lambda: ["http://localhost:3000"])
    trusted_hosts: Any = Field(default_factory=lambda: ["localhost", "127.0.0.1"])

    google_client_ids: Any = Field(default_factory=list)

    openai_api_key: Optional[SecretStr] = Field(default=None)
    openai_api_base: Optional[str] = Field(
        default=None,
        validation_alias=AliasChoices("OPENAI_API_BASE", "OPENAI_BASE_URL"),
    )
    openrouter_api_key: Optional[SecretStr] = Field(default=None)
    openrouter_base_url: str = Field(default="https://openrouter.ai/api/v1")
    openrouter_model: str = Field(default="gpt-oss-120b")

    qdrant_url: Optional[str] = Field(default=None)
    qdrant_api_key: Optional[SecretStr] = Field(default=None)
    qdrant_collection_name: str = Field(
        default="portfolio", min_length=1, max_length=80
    )

    demo_mode: bool = Field(default=False)
    cache_ttl_seconds: int = Field(default=300, ge=30, le=3600)

    @field_validator(
        "allowed_origins", "trusted_hosts", "google_client_ids", mode="before"
    )
    @classmethod
    def _split_comma_separated(cls, value: Any) -> List[str] | None:
        if isinstance(value, str):
            # Handle JSON-like array string: ["a", "b"] -> a, b
            s = value.strip()
            if s.startswith("[") and s.endswith("]"):
                s = s[1:-1]
            return [item.strip().strip("'\"") for item in s.split(",") if item.strip()]
        return value

    @field_validator("jwt_secret_key", mode="before")
    @classmethod
    def _validate_jwt_secret(cls, v: SecretStr | str) -> SecretStr:
        if isinstance(v, str) and len(v) < 12:
            raise ValueError("JWT_SECRET_KEY must be at least 12 characters")
        return SecretStr(v) if isinstance(v, str) else v

    @field_validator("database_url", mode="before")
    @classmethod
    def _validate_database_url(cls, v: str) -> str:
        if v and not v.startswith(
            ("postgresql+psycopg://", "postgresql://", "sqlite://")
        ):
            raise ValueError(
                "DATABASE_URL must use postgresql+psycopg:// or postgresql://"
            )
        return v


@lru_cache
def get_settings() -> Settings:
    """Return a cached settings instance."""
    return Settings()


settings = get_settings()
