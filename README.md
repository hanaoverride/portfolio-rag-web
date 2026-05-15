# Layer

<div align="center">

<!-- Primary Logo SVG -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" fill="none">
  <text x="0" y="46" font-family="Pretendard, sans-serif" font-size="48" font-weight="700" fill="#059669">L</text>
  <text x="34" y="46" font-family="Pretendard, sans-serif" font-size="48" font-weight="300" fill="#14B8A6">ayer</text>
  <circle cx="98" cy="8" r="4" fill="#D97706"/>
</svg>

**Full-Stack Portfolio Project | 풀스택 포트폴리오 프로젝트**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[English](#english) | [한국어](#korean)

</div>

---

<a name="english"></a>
## English

### Project Overview

**Layer** is a full-stack portfolio platform that showcases modern web development with AI-powered content processing. It transforms YouTube videos into readable, searchable text content, demonstrating clean architecture, API design, and responsive UI development.

#### Key Features

- **Video Browsing**: Explore curated YouTube content organized by categories
- **AI Chat**: Ask questions about video content using intelligent AI assistant
- **Bookmarks**: Save and organize your favorite content for quick access
- **Comments**: Engage with the community through comments on each video
- **Search**: Find content quickly with powerful search capabilities
- **Dark Mode**: Comfortable reading experience in any lighting condition

#### Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | FastAPI, Python 3.11+ |
| **Frontend** | Next.js 14, React, TypeScript |
| **Database** | PostgreSQL 15 |
| **Vector DB** | Qdrant |
| **Auth** | JWT, Google OAuth |
| **Styling** | Tailwind CSS |
| **Deployment** | Docker, Docker Compose |

---

### Quick Start

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 24.0+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.20+

#### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/layer.git
cd layer

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **API Docs**: http://localhost:8080/api/v1/docs

---

### Demo Mode

Layer includes a **Demo Mode** that works without any external API keys:

```bash
# In .env or docker-compose.yml
DEMO_MODE=true
```

When Demo Mode is enabled:
- AI chat responses are simulated with pre-defined answers
- No OpenAI API key required
- No Google OAuth credentials needed
- Perfect for development and demonstrations

#### Switch to Real Mode

To use real AI features:

1. Obtain an OpenAI API key from [OpenAI](https://platform.openai.com/)
2. Update your `.env` file:
```env
DEMO_MODE=false
OPENAI_API_KEY=sk-your-api-key-here
```
3. Restart the services: `docker-compose up -d`

---

### Development

#### Backend Development

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"

# Run development server
uvicorn app.main:app --reload --port 8080
```

#### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

#### Database Migrations

Using Alembic for database migrations:

```bash
cd backend

# Create a new migration
alembic revision --autogenerate -m "description"

# Run migrations
alembic upgrade head

# Rollback one version
alembic downgrade -1
```

#### Seed Data and RAG Ingestion

Layer automatically handles database migrations, seeding, and RAG ingestion on startup via the `scripts/start.sh` script.

To manually trigger a refresh of the RAG vector store:

```bash
# Using the Admin API
curl -X POST http://localhost:8080/api/v1/admin/ingest
```

Or run the script manually:

```bash
cd backend
python -m app.data.ingest
```

---

### Deployment

#### Production Checklist

Before deploying to production:

- [ ] Change default JWT secret key (minimum 12 characters)
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Configure database backups
- [ ] Set up monitoring and logging
- [ ] Use strong, unique passwords
- [ ] Enable rate limiting
- [ ] Review and update all environment variables

#### Production Environment Variables

```env
# Required for production
APP_ENV=production
JWT_SECRET_KEY=your-super-secret-key-min-12-chars
DATABASE_URL=postgresql+psycopg://user:password@host:5432/dbname
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional but recommended
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_CLIENT_IDS=your-google-client-id
QDRANT_URL=https://your-qdrant-instance.com
QDRANT_API_KEY=your-qdrant-api-key
```

---

### Screenshots

<div align="center">

#### Home Page | 홈 페이지
*Browse curated content by category*

#### Content Detail | 콘텐츠 상세
*Watch video with synchronized transcript*

#### AI Chat | AI 채팅
*Ask questions about video content*

#### Bookmarks | 북마크
*Save your favorite content*

</div>

---

### API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8080/api/v1/docs
- **ReDoc**: http://localhost:8080/api/v1/redoc
- **OpenAPI Spec**: [backend/docs/openapi.yaml](./backend/docs/openapi.yaml)

Key endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/health` | Health check |
| `GET /api/v1/contents` | List all content |
| `GET /api/v1/contents/{id}` | Get content detail |
| `POST /api/v1/auth/login` | User authentication |
| `GET /api/v1/bookmarks` | List user bookmarks |
| `POST /api/v1/chat/completions` | AI chat completion |

---

<a name="korean"></a>
## 한국어

### 프로젝트 소개

**Layer**는 AI 기반 콘텐츠 처리를 갖춘 현대적인 웹 개발을 선보이는 풀스택 포트폴리오 플랫폼입니다. 유튜브 영상을 읽을 수 있고 검색 가능한 텍스트 콘텐츠로 변환하며, 깔끔한 아키텍처, API 설계, 반응형 UI 개발을 보여줍니다.

#### 주요 기능

- **영상 탐색**: 카테고리별로 정리된 큐레이션된 유튜브 콘텐츠 탐색
- **AI 채팅**: 지능형 AI 어시스턴트를 통해 영상 콘텐츠에 대해 질문하기
- **북마크**: 즐겨찾는 콘텐츠를 저장하고 빠르게 접근하기
- **댓글**: 각 영상에 댓글을 통해 커뮤니티와 소통하기
- **검색**: 강력한 검색 기능으로 콘텐츠 빠르게 찾기
- **다크 모드**: 어떤 조명 환경에서도 편안한 읽기 경험

#### 기술 스택

| 레이어 | 기술 |
|-------|------------|
| **백엔드** | FastAPI, Python 3.11+ |
| **프론트엔드** | Next.js 14, React, TypeScript |
| **데이터베이스** | PostgreSQL 15 |
| **벡터 DB** | Qdrant |
| **인증** | JWT, Google OAuth |
| **스타일링** | Tailwind CSS |
| **배포** | Docker, Docker Compose |

---

### 빠른 시작

#### 사전 요구사항

- [Docker](https://docs.docker.com/get-docker/) 24.0+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.20+

#### 클론 및 설정

```bash
# 저장소 클론
git clone https://github.com/yourusername/layer.git
cd layer

# 환경 파일 복사
cp .env.example .env

# 모든 서비스 시작
docker-compose up -d
```

애플리케이션은 다음 주소에서 사용할 수 있습니다:
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080/api/v1
- **API 문서**: http://localhost:8080/api/v1/docs

---

### 데모 모드

Layer는 외부 API 키 없이도 작동하는 **데모 모드**를 포함하고 있습니다:

```bash
# .env 또는 docker-compose.yml에서
DEMO_MODE=true
```

데모 모드가 활성화되면:
- AI 채팅 응답이 미리 정의된 답변으로 시뮬레이션됩니다
- OpenAI API 키가 필요 없습니다
- Google OAuth 자격 증명이 필요 없습니다
- 개발 및 시연에 완벽합니다

#### 실제 모드로 전환

실제 AI 기능을 사용하려면:

1. [OpenAI](https://platform.openai.com/)에서 OpenAI API 키를 얻습니다
2. `.env` 파일을 업데이트합니다:
```env
DEMO_MODE=false
OPENAI_API_KEY=sk-your-api-key-here
```
3. 서비스를 다시 시작합니다: `docker-compose up -d`

---

### 개발

#### 백엔드 개발

```bash
cd backend

# 가상 환경 생성
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 의존성 설치
pip install -e ".[dev]"

# 개발 서버 실행
uvicorn app.main:app --reload --port 8080
```

#### 프론트엔드 개발

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

#### 데이터베이스 마이그레이션

Alembic을 사용한 데이터베이스 마이그레이션:

```bash
cd backend

# 새 마이그레이션 생성
alembic revision --autogenerate -m "description"

# 마이그레이션 실행
alembic upgrade head

# 한 버전 롤백
alembic downgrade -1
```

#### 샘플 데이터 및 RAG 인제스션

Layer는 `scripts/start.sh` 스크립트를 통해 시작 시 데이터베이스 마이그레이션, 시딩 및 RAG 인제스션을 자동으로 처리합니다.

RAG 벡터 저장소를 수동으로 갱신하려면:

```bash
# Admin API 사용
curl -X POST http://localhost:8080/api/v1/admin/ingest
```

또는 스크립트를 직접 실행하십시오:

```bash
cd backend
python -m app.data.ingest
```

---

### 배포

#### 프로덕션 체크리스트

프로덕션에 배포하기 전:

- [ ] 기본 JWT 비밀 키 변경 (최소 12자)
- [ ] 적절한 CORS 오리진 설정
- [ ] SSL/TLS 인증서 설정
- [ ] 데이터베이스 백업 구성
- [ ] 모니터링 및 로깅 설정
- [ ] 강력하고 고유한 비밀번호 사용
- [ ] 속도 제한 활성화
- [ ] 모든 환경 변수 검토 및 업데이트

#### 프로덕션 환경 변수

```env
# 프로덕션에 필요
APP_ENV=production
JWT_SECRET_KEY=your-super-secret-key-min-12-chars
DATABASE_URL=postgresql+psycopg://user:password@host:5432/dbname
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 선택사항이지만 권장
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_CLIENT_IDS=your-google-client-id
QDRANT_URL=https://your-qdrant-instance.com
QDRANT_API_KEY=your-qdrant-api-key
```

---

### 스크린샷

<div align="center">

#### 홈 페이지 | Home Page
*카테고리별로 큐레이션된 콘텐츠 탐색*

#### 콘텐츠 상세 | Content Detail
*동기화된 대본과 함께 영상 시청*

#### AI 채팅 | AI Chat
*영상 콘텐츠에 대해 질문하기*

#### 북마크 | Bookmarks
*즐겨찾는 콘텐츠 저장하기*

</div>

---

### API 문서

대화형 API 문서는 다음에서 확인할 수 있습니다:
- **Swagger UI**: http://localhost:8080/api/v1/docs
- **ReDoc**: http://localhost:8080/api/v1/redoc
- **OpenAPI Spec**: [backend/docs/openapi.yaml](./backend/docs/openapi.yaml)

주요 엔드포인트:

| 엔드포인트 | 설명 |
|----------|-------------|
| `GET /api/v1/health` | 상태 확인 |
| `GET /api/v1/contents` | 모든 콘텐츠 목록 |
| `GET /api/v1/contents/{id}` | 콘텐츠 상세 정보 |
| `POST /api/v1/auth/login` | 사용자 인증 |
| `GET /api/v1/bookmarks` | 사용자 북마크 목록 |
| `POST /api/v1/chat/completions` | AI 채팅 완성 |

---

## Project Structure | 프로젝트 구조

```
layer/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication
│   │   ├── data/         # Database models & repos
│   │   ├── llm/          # AI chat service
│   │   ├── config.py     # Configuration
│   │   └── main.py       # Application entry
│   ├── alembic/          # Database migrations
│   ├── docs/             # API documentation
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/             # Next.js frontend
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities & hooks
│   ├── public/           # Static assets
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml    # Docker orchestration
├── .env.example          # Environment template
└── README.md             # This file
```

---

## License | 라이선스

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by the Layer Team**

[Report Bug](https://github.com/yourusername/layer/issues) · [Request Feature](https://github.com/yourusername/layer/issues)

</div>
