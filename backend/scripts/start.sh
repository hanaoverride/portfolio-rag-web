#!/bin/bash
set -e

echo "Starting Portfolio Backend Initialization..."

# 1. Run database migrations
echo "Running database migrations..."
alembic upgrade head

# 2. Seed database
echo "Seeding database..."
python -m app.data.seed

# 3. Ingest RAG data
echo "Ingesting RAG data..."
python -m app.data.ingest

echo "Initialization complete. Starting server..."

# 4. Start Uvicorn with reload if in local environment
if [ "$APP_ENV" = "local" ]; then
    echo "Running in local environment with reload..."
    exec uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
else
    echo "Running in $APP_ENV environment..."
    exec uvicorn app.main:app --host 0.0.0.0 --port 8080
fi
