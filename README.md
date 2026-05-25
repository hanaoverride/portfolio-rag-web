<div align="center">

<!-- Primary Logo -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./docs/logo-light.svg">
  <img alt="Layer Logo" src="./docs/logo-light.svg" width="200">
</picture>


**Full-Stack Platform Portfolio | AI-Powered Content Processing & RAG**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Qdrant](https://img.shields.io/badge/Qdrant-FF007F?style=for-the-badge&logo=qdrant&logoColor=white)](https://qdrant.tech/)
[![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

🌍 **[한국어 버전 (Korean Version)은 여기에서 확인하실 수 있습니다.](./README.ko.md)**

</div>

---

## Project Overview

**Layer** is a robust full-stack Platform Portfolio that showcases modern web development with AI-powered content processing. It transforms YouTube videos into highly readable, searchable text content, demonstrating clean architecture, advanced API design, RAG (Retrieval-Augmented Generation) search, and fully responsive frontend views.

---

## Key Features

- **Video Browsing & Automated Ingestion**: Explore curated YouTube content organized by categories and YouTuber channels. Includes robust background processing for parsing video transcripts.
- **Intelligent AI Chat & RAG Support**: Query video transcripts using an advanced AI assistant. Built on top of the OpenAI API and the Qdrant vector database to perform semantic searches and provide precise, context-aware answers.
- **YouTuber Profiles Directory**: Browse dedicated creator profiles containing subscriber statistics, channel descriptions, and their related content counts.
- **Bookmarks & Comments**: Bookmark key videos for quick retrieval, and engage in community discussions with structured comment threads.
- **Interactive Notifications**: Real-time user notification center supporting per-user read/unread tracking and bulk dismiss (delete all) configurations.
- **Notice Board**: Separate administrative announcement system featuring important, site-wide notices and system alerts.
- **Admin Dashboard & Live Statistics**: Administrative portal providing real-time data metrics including total views, bookmarks, comments, contents, and YouTubers.
- **Administrative Data Export**: Secure utility endpoints to export categories, YouTubers, and contents data in structured JSON format.
- **Transactional Password Reset**: Fully secured, email-based password reset flow utilizing Resend API integration.
- **Advanced UX/UI**: Toggle between light and dark modes with sleek animations, and locate videos instantly using a high-performance search engine.

---

## Tech Stack

| Layer | Technology | Purpose & Implementation |
|-------|------------|-------------------------|
| **Backend** | FastAPI (Python 3.11+) | Async high-performance REST API with dependency injection & Pydantic v2 |
| **Frontend** | Next.js 14, React, TypeScript | Single Page Application utilizing App Router, Server Actions, & React Hooks |
| **Database** | PostgreSQL 15 | Relational data persistence with SQLAlchemy 2.0 & Alembic migrations |
| **Vector DB** | Qdrant | Vector engine for semantic chunk storage and fast RAG chat queries |
| **Email Service** | Resend API | Transactional email delivery system for password resets |
| **Auth** | JWT, Argon2, Google OAuth | Robust security containing local auth and Google Single Sign-On |
| **Styling** | Tailwind CSS, Radix UI | Premium custom design system with accessible components & dark mode |
| **Testing** | Pytest, Vitest | Integrated testing suite for both frontend components & backend endpoints |
| **Orchestration** | Docker, Docker Compose | Containerization for consistent local and production execution |

> [!NOTE]
> **Strategic Intent in Version Selection**:
> This project intentionally adopts **proven stable versions** (e.g., Python 3.11+, Next.js 14, PostgreSQL 15, Qdrant v1.7) rather than bleeding-edge beta releases. This deliberate choice narrows down the troubleshooting search space by minimizing library conflicts and runtime instabilities, allowing the development focus to remain strictly on core business logic, performance, and reliable container orchestration.

---

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 24.0+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.20+

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/hanaoverride/layer.git
   cd layer
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   *(For basic local development, default values will work out of the box using **Demo Mode**)*

3. **Spin Up Containers**
   ```bash
   docker-compose up -d
   ```

Once fully loaded, the core services will be accessible at:
- **Frontend App**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **API Docs (Swagger UI)**: http://localhost:8080/api/v1/docs

---

## Demo Mode vs. Production Mode

### Demo Mode (Default)
By default, the platform boots up with `DEMO_MODE=true` in `.env`.
- No external OpenAI API keys or Google OAuth client IDs are required.
- AI chat interactions are simulated using mock responses.
- Perfect for local feature exploration and quick demonstrations.

### Real Mode (AI & Vector Enabled)
To enable authentic AI completions and vector searching:
1. Obtain an API key from [OpenAI](https://platform.openai.com/).
2. Adjust your `.env` settings:
   ```env
   DEMO_MODE=false
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```
3. Restart the environment:
   ```bash
   docker-compose down && docker-compose up -d
   ```

#### 💡 API Base & Compatibility Layer (Swappable LLM Providers)
The platform is designed with an **API Compatibility Layer**. You are not locked into OpenAI's native endpoints. By configuring `OPENAI_API_BASE` (and optionally `OPENAI_CHAT_MODEL`), you can direct the backend client to any OpenAI-compatible API gateway (e.g., OpenRouter, DeepSeek, LocalAI, Ollama, or self-hosted LLM servers):
```env
OPENAI_API_BASE=https://openrouter.ai/api/v1  # Or your local/alternative LLM gateway
OPENAI_API_KEY=your-provider-api-key
OPENAI_CHAT_MODEL=deepseek/deepseek-chat      # Specify the alternative model name
```
This architecture provides immense flexibility and enables seamless switching of LLM backends without modifying a single line of application code.

---

## Software Quality & CI Pipeline

To ensure the highest software quality and prevent regressions, the project leverages a containerized Continuous Integration (CI) pipeline. All code verification and static analyses are executed strictly within isolated Docker containers to guarantee environment consistency.

The pipeline consists of three core quality gates:

### 1. Static Analysis & Linting (Code Quality)
Analyzes code style, enforces strict conventions, and flags potential bugs early:
* **Backend**: Run using `ruff` inside the backend container to verify Python formatting and clean syntax.
  ```bash
  docker-compose exec -T backend ruff check .
  ```
* **Frontend**: Run using `eslint` inside the frontend container to maintain JavaScript/TypeScript styles.
  ```bash
  docker-compose exec -T frontend npm run lint
  ```

### 2. Type Safety Verification
Ensures robust type soundness and prevents compile-time bugs:
* **Frontend**: Compiles and verifies TypeScript definitions using `tsc`.
  ```bash
  docker-compose exec -T frontend npx tsc --noEmit
  ```

### 3. Automated Test Suites (Behavioral Verification)
Executes our comprehensive unit and integration test suites:
* **Backend**: Run FastAPI endpoints and business logic tests using `pytest`.
  ```bash
  docker-compose exec -T backend pytest
  ```
* **Frontend**: Run Next.js page routing and component lifecycle tests using `vitest`.
  ```bash
  docker-compose exec -T frontend npm run test
  ```

---

## Deployment & Production Checklist

Prior to launching in a production environment, ensure the following checklist is completed:

- [ ] Change the default `JWT_SECRET_KEY` (must be at least 12 characters).
- [ ] Restrict `ALLOWED_ORIGINS` to trusted client domains.
- [ ] Configure `RESEND_API_KEY` for password resets.
- [ ] Ensure valid SSL/TLS certificates are active.
- [ ] Establish automated PostgreSQL database backups.
- [ ] Enable rate-limiting features on key API routes.
- [ ] Securely update all standard passwords and environment values.

### Production Environment Variable Template

```env
# Runtime
APP_ENV=production
JWT_SECRET_KEY=highly-secure-jwt-key-minimum-12-characters
DATABASE_URL=postgresql+psycopg://user:password@host:5432/dbname
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Integrations
OPENAI_API_KEY=sk-production-openai-api-key
GOOGLE_CLIENT_IDS=production-google-client-id
QDRANT_URL=https://production-qdrant-instance.com
QDRANT_API_KEY=production-qdrant-api-key
RESEND_API_KEY=re_production-resend-api-key
MAIL_FROM=Layer <noreply@yourdomain.com>
FRONTEND_URL=https://yourdomain.com
```

---

## API Endpoints Reference

Interactive documentation is available out-of-the-box:
- **Swagger UI**: http://localhost:8080/api/v1/docs
- **ReDoc**: http://localhost:8080/api/v1/redoc
- **OpenAPI Specification**: Located at [backend/docs/openapi.yaml](./backend/docs/openapi.yaml)

### Core Endpoints Table

| Endpoint | Method | Access Level | Description |
|----------|--------|--------------|-------------|
| `/api/v1/health` | GET | Public | Server health status check |
| `/api/v1/contents` | GET | Public | List and search all ingested video content |
| `/api/v1/contents/{id}` | GET | Public | Retrieve a specific video content detail and transcript |
| `/api/v1/youtubers` | GET | Public | Retrieve all curated creator channels |
| `/api/v1/notices` | GET | Public | Fetch site-wide announcements and notice lists |
| `/api/v1/auth/login` | POST | Public | Standard JWT user login |
| `/api/v1/bookmarks` | GET | User | Retrieve bookmarks saved by the authenticated user |
| `/api/v1/notifications` | GET | User | Fetch notifications assigned to the user |
| `/api/v1/chat/completions` | POST | User | Core AI RAG chat assistant completion |
| `/api/v1/statistics` | GET | Admin | Retrieve platform metrics and usage statistics |
| `/api/v1/export` | GET | Admin | Export platform database contents in JSON format |

---

## Project Structure

```
layer/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/          # API routes (v1 endpoints: contents, chat, notifications, notices, categories, statistics, youtubers, export, etc.)
│   │   ├── auth/         # Authentication (Argon2, OAuth & JWT token logic)
│   │   ├── data/         # Database models, schemas & database connection
│   │   ├── llm/          # AI chat service (RAG, OpenAI integration)
│   │   ├── services/     # Email (Resend) and notification logic
│   │   ├── config.py     # Configuration using pydantic-settings
│   │   └── main.py       # Application entry
│   ├── alembic/          # Database migrations
│   ├── docs/             # API documentation
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/             # Next.js frontend
│   ├── app/              # App router pages (contents, search, categories, bookmarks, notifications, notices, admin dashboard, profile, info pages, etc.)
│   ├── components/       # React components (content, common, layout, home, youtubers)
│   ├── lib/              # API clients, custom hooks, and utilities
│   ├── public/           # Static assets
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml    # Docker orchestration
├── .env.example          # Environment template
└── README.md             # Primary README (English)
```

---

## License

MIT License - see the `LICENSE` file for details.

---

<div align="center">


[Report Bug](https://github.com/hanaoverride/layer/issues) · [Request Feature](https://github.com/hanaoverride/layer/issues)

</div>
