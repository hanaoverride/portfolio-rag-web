<div align="center">

# Layer

<!-- Primary Logo -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./docs/logo-light.svg">
  <img alt="Layer Logo" src="./docs/logo-light.svg" width="200">
</picture>


**풀스택 플랫폼 포트폴리오 | AI 기반 콘텐츠 처리 및 RAG**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Qdrant](https://img.shields.io/badge/Qdrant-FF007F?style=for-the-badge&logo=qdrant&logoColor=white)](https://qdrant.tech/)
[![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

🌍 **[English Version (영어 버전)은 여기에서 확인하실 수 있습니다.](./README.md)**

</div>

---

## 프로젝트 소개

**Layer**는 AI 기반 콘텐츠 처리를 갖춘 현대적인 웹 개발을 선보이는 고성능 풀스택 플랫폼 포트폴리오입니다. 유튜브 영상을 읽을 수 있고 검색 가능한 고해상도 텍스트 콘텐츠로 자동 변환하며, 깔끔한 아키텍처, 효율적인 API 설계, RAG(검색 증강 생성) 기반 시맨틱 검색, 그리고 뛰어난 반응형 프론트엔드 뷰를 완벽히 구현하였습니다.

---

## 주요 기능

- **영상 탐색 및 자동 수집**: 카테고리 및 유튜버 채널별로 정리된 큐레이션 콘텐츠 탐색. 유튜브 영상 대본을 자동으로 파싱하는 백그라운드 처리 기능 포함.
- **지능형 AI 채팅 및 RAG 지원**: OpenAI API와 Qdrant 벡터 데이터베이스를 활용하여, 영상 대본 데이터에서 의미 기반(Semantic) 검색을 수행하고 정밀하고 맥락에 알맞은 답변을 제공하는 AI 비서 서비스.
- **유튜버 프로필 디렉토리**: 큐레이션된 크리에이터들의 채널 설명, 구독자 통계, 플랫폼 내 관련 콘텐츠 수 등 상세 프로필 제공.
- **북마크 및 댓글**: 중요한 영상을 빠르게 찾아볼 수 있는 북마크 기능과 유기적인 커뮤니티 토론을 위한 계층형 댓글 스레드.
- **실시간 사용자 알림**: 사용자별 읽음/안읽음 상태 추적 및 전체 삭제 기능이 내장되어 편리하게 관리할 수 있는 알림 센터.
- **공지사항 게시판**: 중요한 사이트 공지 및 행정 업데이트를 전용으로 공지하기 위한 공지사항 게시판 제공.
- **관리자 대시보드 및 실시간 통계**: 조회수, 북마크 수, 댓글 수, 크리에이터 및 콘텐츠 총수 등 서비스 활성화 지표를 실시간으로 모니터링하는 관리자 포털.
- **행정용 데이터 내보내기**: 카테고리, 유튜버, 콘텐츠 통합 데이터를 구조화된 JSON 파일로 손쉽게 내보낼 수 있는 보안 엔드포인트 제공.
- **트랜잭셔널 비밀번호 초기화**: Resend API 연동을 기반으로 안전하게 설계된 이메일 인증 방식의 비밀번호 재설정 기능.
- **다이내믹한 사용자 경험(UX/UI)**: 매끄러운 미세 애니메이션이 포함된 라이트/다크 테마 토글 및 고성능 검색 엔진을 통한 빠른 콘텐츠 검색.

---

## 기술 스택

| 레이어 | 기술 | 목적 및 상세 구현 내용 |
|-------|------------|-------------------------|
| **백엔드** | FastAPI (Python 3.11+) | 의존성 주입(Dependency Injection)과 Pydantic v2 기반의 비동기 고성능 REST API |
| **프론트엔드** | Next.js 14, React, TypeScript | App Router, Server Actions 및 React Hooks를 활용한 고효율 단일 페이지 애플리케이션 |
| **데이터베이스** | PostgreSQL 15 | SQLAlchemy 2.0 및 Alembic 마이그레이션을 활용한 안정적인 관계형 데이터 설계 |
| **벡터 DB** | Qdrant | 시맨틱 대본 텍스트 청크 저장 및 고속 RAG 대화 쿼리를 위한 벡터 엔진 |
| **이메일 서비스** | Resend API | 비밀번호 재설정 이메일 등의 안전한 발송을 위한 트랜잭셔널 메일 전송 API |
| **인증/보안** | JWT, Argon2, Google OAuth | 안전한 자체 이메일 회원 가입 및 구글 소셜 로그인 연동 |
| **스타일링** | Tailwind CSS, Radix UI | 접근성 높은 프리미엄 컴포넌트 설계 및 반응형 다크 모드 지원 |
| **테스트** | Pytest, Vitest | 백엔드 API 엔드포인트 및 프론트엔드 컴포넌트의 유닛/통합 테스트 환경 구축 |
| **배포/운영** | Docker, Docker Compose | 개발 및 상용 운영 환경의 동일한 실행 상태 보장을 위한 컨테이너화 |

> [!NOTE]
> **기술 스택 버전 선택의 전략적 의도**:
> 본 프로젝트는 가장 최신의 실험적 릴리즈 대신, 검증된 **안정화 버전(Stable Version)**(예: Python 3.11+, Next.js 14, PostgreSQL 15, Qdrant v1.7 등)을 의도적으로 채택했습니다. 이는 실제 개발 및 컨테이너 빌드 과정에서 발생할 수 있는 잠재적인 라이브러리 충돌이나 불안정한 런타임 오류의 **트러블슈팅 탐색 공간(Troubleshooting Search Space)을 제한**하여, 아키텍처 설계와 비즈니스 로직 최적화에 역량을 집중하기 위함입니다.

---

## 빠른 시작

### 사전 요구사항

- [Docker](https://docs.docker.com/get-docker/) 24.0+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.20+

### 설치 및 실행 단계

1. **저장소 클론**
   ```bash
   git clone https://github.com/hanaoverride/layer.git
   cd layer
   ```

2. **환경 변수 파일 복사**
   ```bash
   cp .env.example .env
   ```
   *(로컬 개발 및 단순 테스트 목적이라면, 별도의 API 키 주입 없이 기본 설정인 **데모 모드**로 즉시 작동합니다)*

3. **서비스 컨테이너 실행**
   ```bash
   docker-compose up -d
   ```

구동이 완료되면 다음 로컬 주소로 서비스에 액세스할 수 있습니다:
- **프론트엔드 앱**: http://localhost:3000
- **백엔드 API**: http://localhost:8080/api/v1
- **API 문서 (Swagger UI)**: http://localhost:8080/api/v1/docs

---

## 데모 모드와 실제 운영 모드

### 데모 모드 (기본값)
기본 설정은 `.env`에서 `DEMO_MODE=true`로 활성화되어 있습니다.
- OpenAI API 키나 Google OAuth 클라이언트 ID가 없어도 즉시 작동합니다.
- AI 채팅 등의 답변이 미리 정의된 템플릿 답변으로 가상 응답(Simulated) 처리됩니다.
- 초기 로컬 탐색 및 화면 확인용으로 매우 유용합니다.

### 실제 운영 모드 (AI 및 벡터 연동)
실제 AI 모델의 고도화된 대화와 시맨틱 RAG 검색을 체험하려면:
1. [OpenAI](https://platform.openai.com/)에서 API 키를 발급받습니다.
2. `.env` 설정을 다음과 같이 수정합니다:
   ```env
   DEMO_MODE=false
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```
3. 환경을 재시작합니다:
   ```bash
   docker-compose down && docker-compose up -d
   ```

#### 💡 API Base 및 호환성 레이어 (유연한 LLM 공급자 전환)
본 플랫폼은 특정 LLM 공급자(OpenAI)에 종속되지 않도록 **API 호환성 레이어(Compatibility Layer)**를 지원하도록 설계되었습니다. `.env` 파일에서 `OPENAI_API_BASE` (및 선택적으로 `OPENAI_CHAT_MODEL`) 변수를 설정하면, OpenAI 규격을 지원하는 다양한 대체 서비스(예: OpenRouter, DeepSeek, LocalAI, Ollama 또는 자체 호스트 LLM 서버)로 백엔드 소스 코드 수정 없이 즉시 전환할 수 있습니다:
```env
OPENAI_API_BASE=https://openrouter.ai/api/v1  # 대체 LLM 게이트웨이 주소
OPENAI_API_KEY=your-provider-api-key
OPENAI_CHAT_MODEL=deepseek/deepseek-chat      # 대체 모델 이름 지정
```
이러한 유연한 호환성 설계를 통해 벤더 종속성(Vendor Lock-in)을 방지하고 비용 최적화 및 인프라 이식성을 극대화했습니다.

---

## 소프트웨어 품질 및 CI 파이프라인

코드 품질을 유지하고 회귀 버그(Regression)를 방지하기 위해, 본 프로젝트는 컨테이너 기반의 지속적 통합(Continuous Integration, CI) 파이프라인 설계를 따르고 있습니다. 모든 유효성 검사 및 정적 분석은 독립된 Docker 컨테이너 내에서 안전하게 실행되어 개발 및 운영 환경의 일관성을 완벽하게 보장합니다.

소프트웨어 품질 확보를 위한 핵심 검증 단계는 다음과 같습니다:

### 1. 정적 분석 및 린트 검사 (Code Quality)
코드 스타일을 강제하고, 잠재적 논리 결함을 사전에 탐지합니다:
* **백엔드**: FastAPI 컨테이너 내에서 `ruff`를 통해 Python 코드 포맷 및 구문을 신속하게 검사합니다.
  ```bash
  docker-compose exec -T backend ruff check .
  ```
* **프론트엔드**: Next.js 컨테이너 내에서 `eslint`를 통해 일관성 있는 스타일 규칙을 적용합니다.
  ```bash
  docker-compose exec -T frontend npm run lint
  ```

### 2. 정적 타입 검증 (Type Safety)
TypeScript 정적 타입을 엄격하게 체크하여 런타임 오류를 컴파일 단계에서 차단합니다:
* **프론트엔드**: Next.js 컨테이너 내에서 `tsc --noEmit`을 호출하여 타입 안전성을 검증합니다.
  ```bash
  docker-compose exec -T frontend npx tsc --noEmit
  ```

### 3. 자동화 테스트 스위트 (Behavioral Verification)
주요 핵심 비즈니스 로직과 컴포넌트의 동작 유효성을 검증합니다:
* **백엔드**: `pytest` 테스트 프레임워크를 기반으로 비동기 API 엔드포인트 및 RAG 로직의 정합성을 검증합니다.
  ```bash
  docker-compose exec -T backend pytest
  ```
* **프론트엔드**: `vitest` 테스트 라이브러리를 활용해 React 컴포넌트의 렌더링 및 라이프사이클 동작을 점검합니다.
  ```bash
  docker-compose exec -T frontend npm run test
  ```

---

## 운영 배포 체크리스트

프로덕션 서버로 서비스를 릴리즈하기 전에 아래 보안 검토 사항을 충족해야 합니다:

- [ ] 기본값인 `JWT_SECRET_KEY`를 변경합니다 (반드시 12자 이상의 문자열 사용).
- [ ] `ALLOWED_ORIGINS`에 허용할 신뢰할 수 있는 사용자 도메인만 입력합니다.
- [ ] 비밀번호 재설정 메일 전송을 위해 `RESEND_API_KEY`를 등록합니다.
- [ ] SSL/TLS 인증서가 정상적으로 활성화되어 있는지 점검합니다.
- [ ] 안정적인 데이터 보존을 위해 PostgreSQL 백업을 설정합니다.
- [ ] 주요 민감한 API 라우트에 속도 제한(Rate limiting)을 적용합니다.
- [ ] 모든 기본 자격 증명 암호 및 환경변수 값을 최종 보안 사양으로 변경합니다.

### 프로덕션 환경 변수 설정 템플릿

```env
# 실행 환경
APP_ENV=production
JWT_SECRET_KEY=highly-secure-jwt-key-minimum-12-characters
DATABASE_URL=postgresql+psycopg://user:password@host:5432/dbname
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 외부 연동 서비스
OPENAI_API_KEY=sk-production-openai-api-key
GOOGLE_CLIENT_IDS=production-google-client-id
QDRANT_URL=https://production-qdrant-instance.com
QDRANT_API_KEY=production-qdrant-api-key
RESEND_API_KEY=re_production-resend-api-key
MAIL_FROM=Layer <noreply@yourdomain.com>
FRONTEND_URL=https://yourdomain.com
```

---

## API 엔드포인트 참조

FastAPI가 제공하는 편리한 인터랙티브 API 문서를 활용할 수 있습니다:
- **Swagger UI**: http://localhost:8080/api/v1/docs
- **ReDoc**: http://localhost:8080/api/v1/redoc
- **OpenAPI Specification**: [backend/docs/openapi.yaml](./backend/docs/openapi.yaml) 파일 참조

### 핵심 API 라우트 일람

| 엔드포인트 | 요청 방식 | 접근 수준 | 설명 |
|----------|--------|--------------|-------------|
| `/api/v1/health` | GET | 전체 공개 | 서버의 현재 헬스 체크 상태 |
| `/api/v1/contents` | GET | 전체 공개 | 플랫폼에 등록된 비디오 콘텐츠 목록 조회 및 검색 |
| `/api/v1/contents/{id}` | GET | 전체 공개 | 특정 영상의 상세 메타데이터 및 전체 대본 조회 |
| `/api/v1/youtubers` | GET | 전체 공개 | 수집/관리 중인 유튜버 크리에이터 채널 리스트 조회 |
| `/api/v1/notices` | GET | 전체 공개 | 사이트 내 주요 공지사항 및 공지 게시글 조회 |
| `/api/v1/auth/login` | POST | 전체 공개 | 기존 사용자 JWT 인증 로그인 |
| `/api/v1/bookmarks` | GET | 일반 회원 | 현재 사용자가 보관한 북마크 콘텐츠 리스트 조회 |
| `/api/v1/notifications` | GET | 일반 회원 | 로그인 회원에게 할당된 맞춤형 알림 내역 확인 |
| `/api/v1/chat/completions` | POST | 일반 회원 | 해당 영상 대본 기반 RAG AI 챗 비서 완성 기능 |
| `/api/v1/statistics` | GET | 관리자 전용 | 서비스 활성 상태 및 사용량 통계 조회 |
| `/api/v1/export` | GET | 관리자 전용 | 플랫폼 내 주요 테이블 통합 데이터를 JSON으로 다운로드 |

---

## 프로젝트 구조

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
└── README.md             # 기본 리드미 파일 (영어)
```

---

## 라이선스

MIT License - 자세한 설명은 `LICENSE` 파일을 참고하십시오.

---

<div align="center">


[Report Bug](https://github.com/hanaoverride/layer/issues) · [Request Feature](https://github.com/hanaoverride/layer/issues)

</div>
