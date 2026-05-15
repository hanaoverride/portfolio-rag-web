"""Self-contained seed data for portfolio project."""

from datetime import datetime, timezone

# Categories
CATEGORIES = [
    {"id": "cat_web_dev", "name": "Web Dev", "slug": "web-dev"},
    {"id": "cat_typescript", "name": "TypeScript", "slug": "typescript"},
    {"id": "cat_programming", "name": "Programming", "slug": "programming"},
]

# YouTubers
YOUTUBERS = [
    {
        "id": "ytb_fireship",
        "name": "Fireship",
        "avatar": "https://ui-avatars.com/api/?name=Fireship&background=ff5252&color=fff",
        "channel_url": "https://www.youtube.com/@Fireship",
        "subscribers": 2500000,
        "description": "High-intensity lessons about programming, Firebase, and tech",
        "categories": ["web-dev", "typescript", "programming"],
        "content_count": 400,
    },
    {
        "id": "ytb_theo",
        "name": "Theo - t3.gg",
        "avatar": "https://ui-avatars.com/api/?name=Theo&background=6366f1&color=fff",
        "channel_url": "https://www.youtube.com/@t3dotgg",
        "subscribers": 600000,
        "description": "Full-stack development, TypeScript, and the T3 Stack",
        "categories": ["web-dev", "typescript"],
        "content_count": 200,
    },
    {
        "id": "ytb_primeagen",
        "name": "ThePrimeagen",
        "avatar": "https://ui-avatars.com/api/?name=Primeagen&background=10b981&color=fff",
        "channel_url": "https://www.youtube.com/@ThePrimeagen",
        "subscribers": 800000,
        "description": "Vim, Neovim, algorithms, and programming fundamentals",
        "categories": ["programming", "web-dev"],
        "content_count": 300,
    },
]

# Contents
CONTENTS = [
    {
        "id": "I4EWvMFj37g",
        "title": "Bash 쉘 스크립트 100초 완벽 요약",
        "description": "Bash 쉘 스크립트의 기본 개념부터 고급 활용법까지 100초 만에 마스터합니다. 터미널 자동화의 첫걸음",
        "thumbnail": "https://i.ytimg.com/vi/I4EWvMFj37g/maxresdefault.jpg",
        "video_url": "https://www.youtube.com/watch?v=I4EWvMFj37g",
        "category": ["web-dev", "programming"],
        "author_name": "Fireship",
        "author_avatar": "https://ui-avatars.com/api/?name=Fireship&background=ff5252&color=fff",
        "duration": 153,
        "views": 2000000,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_new": True,
        "table_of_contents": [
            {
                "id": "intro",
                "title": "Bash란?",
                "emoji": "🐚",
                "level": 1,
                "timestamp": 0,
            },
            {
                "id": "syntax",
                "title": "기본 문법",
                "emoji": "📝",
                "level": 1,
                "timestamp": 30,
            },
            {
                "id": "scripts",
                "title": "스크립트 작성",
                "emoji": "📜",
                "level": 1,
                "timestamp": 60,
            },
            {
                "id": "advanced",
                "title": "고급 기능",
                "emoji": "⚡",
                "level": 1,
                "timestamp": 90,
            },
        ],
        "body_content": """# Bash 쉘 스크립트 100초 요약

## Bash란?
Bash(Bourne Again SHell)는 유닉스/리눅스 시스템에서 가장 널리 사용되는 명령어 셸입니다. 터미널에서 명령어를 입력하면 운영체제가 이를 해석하고 실행합니다.

## 기본 문법
변수 선언은 `NAME=value` 형태로 합니다. 참조할 때는 `$NAME` 또는 `${NAME}`을 사용합니다. 조건문은 `if`, `elif`, `else`로 구성됩니다.

## 스크립트 작성
```bash
#!/bin/bash
echo "Hello, World!"
for i in {1..5}; do
  echo "Count: $i"
done
```

## 고급 기능
백그라운드 실행은 명령어 뒤에 `&`를 붙입니다. 함수를 정의하여 코드를 모듈화할 수 있습니다. 파이프(`|`)와 리다이렉션(`>`, `>>`)으로 입출력을 제어합니다.

## 실전 활용
크론잡으로 스크립트를 주기적으로 실행하거나, CI/CD 파이프라인에서 bash 스크립트를 활용해 빌드와 배포를 자동화할 수 있습니다.""",
        "related_contents": [],
    },
    {
        "id": "446E-r0rXHI",
        "title": "Go 언어 100초 만에 익히기",
        "description": "Google에서 개발한 Go 프로그래밍 언어의 핵심 개념과 문법을 100초 안에 정리합니다. 고성능 서버 개발의 입문",
        "thumbnail": "https://i.ytimg.com/vi/446E-r0rXHI/maxresdefault.jpg",
        "video_url": "https://www.youtube.com/watch?v=446E-r0rXHI",
        "category": ["web-dev", "programming"],
        "author_name": "Fireship",
        "author_avatar": "https://ui-avatars.com/api/?name=Fireship&background=ff5252&color=fff",
        "duration": 149,
        "views": 2200000,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_new": False,
        "table_of_contents": [
            {
                "id": "intro",
                "title": "Go 언어 소개",
                "emoji": "🔷",
                "level": 1,
                "timestamp": 0,
            },
            {
                "id": "syntax",
                "title": "기본 문법과 타입",
                "emoji": "📐",
                "level": 1,
                "timestamp": 25,
            },
            {
                "id": "concurrency",
                "title": "고루틴과 동시성",
                "emoji": "⚙️",
                "level": 1,
                "timestamp": 60,
            },
            {
                "id": "compile",
                "title": "컴파일과 실행",
                "emoji": "🚀",
                "level": 1,
                "timestamp": 110,
            },
        ],
        "body_content": """# Go 언어 100초 완벽 정리

## Go 언어 소개
Go는 Google에서 2007년에 개발한 정적 타입 컴파일 언어입니다. 간결한 문법과 빠른 컴파일 속도, 강력한 동시성 지원이 특징입니다. Docker, 쿠버네티스 등 주요 인프라 도구들이 Go로 작성되었습니다.

## 기본 문법
```go
package main
import "fmt"
func main() {
    fmt.Println("Hello Go!")
}
```
변수 선언은 `var name type` 또는 `:=` 단축 문법을 사용합니다. Go는 타입 추론을 지원합니다.

## 고루틴과 동시성
`go` 키워드로 함수를 고루틴으로 실행할 수 있습니다. 채널(channel)을 통해 고루틴 간 데이터를 안전하게 주고받습니다.

## 장점
컴파일 속도가 매우 빠르고, 정적 링크로 단일 바이너리를 생성합니다. 내장된 포매터(gofmt)로 일관된 코드 스타일을 유지합니다.""",
        "related_contents": [],
    },
    {
        "id": "YkOSUVzOAA4",
        "title": "T3 Stack 완벽 튜토리얼: Next.js + tRPC + Prisma",
        "description": "T3 Stack을 사용한 풀스택 애플리케이션 구축 방법을 단계별로 설명합니다. 타입 안전성을 극대화하는 현대적인 개발 스택",
        "thumbnail": "https://i.ytimg.com/vi/YkOSUVzOAA4/maxresdefault.jpg",
        "video_url": "https://www.youtube.com/watch?v=YkOSUVzOAA4",
        "category": ["web-dev", "typescript"],
        "author_name": "Theo - t3.gg",
        "author_avatar": "https://ui-avatars.com/api/?name=Theo&background=6366f1&color=fff",
        "duration": 1500,
        "views": 450000,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_new": False,
        "table_of_contents": [
            {
                "id": "intro",
                "title": "T3 Stack 소개",
                "emoji": "📚",
                "level": 1,
                "timestamp": 0,
            },
            {
                "id": "setup",
                "title": "프로젝트 설정",
                "emoji": "⚙️",
                "level": 1,
                "timestamp": 180,
            },
            {
                "id": "trpc",
                "title": "tRPC 라우터 구현",
                "emoji": "🔗",
                "level": 1,
                "timestamp": 600,
            },
            {
                "id": "deploy",
                "title": "배포하기",
                "emoji": "🚀",
                "level": 1,
                "timestamp": 1200,
            },
        ],
        "body_content": """# T3 Stack 튜토리얼

## T3 Stack 소개
T3 Stack은 Theo가 창시한 풀스택 TypeScript 개발 스택입니다. Next.js, tRPC, Prisma, Tailwind CSS, NextAuth.js로 구성되며 엔드투엔드 타입 안전성을 목표로 합니다.

## 프로젝트 설정
create-t3-app CLI를 사용하면 몇 초 만에 프로젝트를 시작할 수 있습니다. 필요한 모듈을 선택적으로 추가할 수 있습니다.

## tRPC 라우터 구현
tRPC를 사용하면 API 계층 없이 프론트엔드에서 백엔드 함수를 직접 호출할 수 있습니다. 타입 추론이 완벽하게 작동하여 API 명세가 필요 없습니다.

## Prisma 스키마
```prisma
model User {
  id    String @id @default(cuid())
  name  String
  posts Post[]
}
```

## 배포
Vercel에 원클릭 배포가 가능합니다. 데이터베이스는 PlanetScale 또는 Supabase를 추천합니다.""",
        "related_contents": [],
    },
    {
        "id": "4XgIvE5SH4Y",
        "title": "TypeScript 사상 최대 업데이트 분석",
        "description": "TypeScript의 최신 주요 업데이트에 포함된 새로운 기능과 변경사항을 상세히 분석합니다. 개발자 생산성에 미치는 영향",
        "thumbnail": "https://i.ytimg.com/vi/4XgIvE5SH4Y/maxresdefault.jpg",
        "video_url": "https://www.youtube.com/watch?v=4XgIvE5SH4Y",
        "category": ["typescript"],
        "author_name": "Theo - t3.gg",
        "author_avatar": "https://ui-avatars.com/api/?name=Theo&background=6366f1&color=fff",
        "duration": 1810,
        "views": 101500,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_new": False,
        "table_of_contents": [
            {
                "id": "intro",
                "title": "업데이트 개요",
                "emoji": "📋",
                "level": 1,
                "timestamp": 0,
            },
            {
                "id": "newfeat",
                "title": "주요 신규 기능",
                "emoji": "✨",
                "level": 1,
                "timestamp": 300,
            },
            {
                "id": "breaking",
                "title": "변경사항과 마이그레이션",
                "emoji": "⚠️",
                "level": 1,
                "timestamp": 900,
            },
            {
                "id": "verdict",
                "title": "개발자 관점 평가",
                "emoji": "🎯",
                "level": 1,
                "timestamp": 1500,
            },
        ],
        "body_content": """# TypeScript 사상 최대 업데이트 분석

## 업데이트 개요
TypeScript 팀이 발표한 주요 업데이트는 수많은 새로운 기능과 개선사항을 포함합니다. 이번 릴리스는 타입 시스템의 표현력을 크게 확장합니다.

## 주요 신규 기능
- 데코레이터 표준화: ECMAScript 데코레이터와의 호환성 개선
- const 타입 파라미터: 더 정확한 타입 추론
- 인덱스 시그니처 개선: 매핑된 타입의 유연성 향상

## 실용적인 팁
```typescript
// const 타입 파라미터 활용
function getConfig<const T extends string[]>(...args: T) {
  return args;
}
```

## 마이그레이션 가이드
기존 프로젝트를 업데이트할 때는 `strict` 모드를 활성화하고, 새로운 기능을 점진적으로 도입하는 것이 좋습니다. 대부분의 변경사항은 하위 호환성을 유지합니다.""",
        "related_contents": [],
    },
    {
        "id": "w7i4amO_zaE",
        "title": "Neovim 처음부터 끝까지 설정하기: 0에서 LSP까지",
        "description": "완전 초보자를 위한 Neovim 설정 가이드. 플러그인 매니저부터 LSP, 자동 완성까지 모든 것을 직접 설정해봅니다",
        "thumbnail": "https://i.ytimg.com/vi/w7i4amO_zaE/maxresdefault.jpg",
        "video_url": "https://www.youtube.com/watch?v=w7i4amO_zaE",
        "category": ["programming"],
        "author_name": "ThePrimeagen",
        "author_avatar": "https://ui-avatars.com/api/?name=Primeagen&background=10b981&color=fff",
        "duration": 1847,
        "views": 1900000,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_new": False,
        "table_of_contents": [
            {
                "id": "why",
                "title": "왜 Neovim인가?",
                "emoji": "🤔",
                "level": 1,
                "timestamp": 0,
            },
            {
                "id": "install",
                "title": "설치 및 기본 설정",
                "emoji": "💻",
                "level": 1,
                "timestamp": 120,
            },
            {
                "id": "plugins",
                "title": "플러그인 설정",
                "emoji": "🔌",
                "level": 1,
                "timestamp": 480,
            },
            {
                "id": "lsp",
                "title": "LSP와 자동 완성",
                "emoji": "🧠",
                "level": 1,
                "timestamp": 900,
            },
            {
                "id": "tips",
                "title": "실전 팁",
                "emoji": "💡",
                "level": 1,
                "timestamp": 1500,
            },
        ],
        "body_content": """# Neovim 처음부터 끝까지

## 왜 Neovim인가?
Vim의 현대적인 재구현인 Neovim은 비동기 플러그인, 내장 LSP 클라이언트, Lua API 등 강력한 기능을 제공합니다. 한번 익숙해지면 다른 에디터로 돌아가기 어렵습니다.

## 설치 및 기본 설정
```lua
-- init.lua 기본 구조
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
```

## 플러그인 설정
lazy.nvim을 사용한 플러그인 관리가 가장 인기 있습니다. 각 플러그인의 설정을 모듈화하여 관리하면 유지보수가 쉬워집니다.

## LSP와 자동 완성
mason.nvim으로 LSP 서버를 설치하고, nvim-cmp로 자동 완성을 설정합니다. tsserver, pyright, rust-analyzer 등 다양한 언어 서버를 지원합니다.

## 실전 팁
단축키를 외우는 것보다 필요한 순간에 찾아서 쓰는 것이 더 효과적입니다. 점진적으로 학습하는 것이 지속 가능한 방법입니다.""",
        "related_contents": [],
    },
    {
        "id": "X6AR2RMB5tE",
        "title": "Vim 에디터 완전 정복: 입문자를 위한 가이드",
        "description": "Vim 에디터의 기본 개념과 효율적인 사용법을 배우고, 실제 개발 환경에서 Vim을 최대한 활용하는 방법을 소개합니다",
        "thumbnail": "https://i.ytimg.com/vi/X6AR2RMB5tE/maxresdefault.jpg",
        "video_url": "https://www.youtube.com/watch?v=X6AR2RMB5tE",
        "category": ["programming"],
        "author_name": "ThePrimeagen",
        "author_avatar": "https://ui-avatars.com/api/?name=Primeagen&background=10b981&color=fff",
        "duration": 744,
        "views": 1400000,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_new": True,
        "table_of_contents": [
            {
                "id": "basics",
                "title": "Vim 기본 개념",
                "emoji": "📖",
                "level": 1,
                "timestamp": 0,
            },
            {
                "id": "motions",
                "title": "모션과 단축키",
                "emoji": "🧭",
                "level": 1,
                "timestamp": 150,
            },
            {
                "id": "modes",
                "title": "모드 이해하기",
                "emoji": "🔄",
                "level": 1,
                "timestamp": 360,
            },
            {
                "id": "practice",
                "title": "실전 연습",
                "emoji": "⚡",
                "level": 1,
                "timestamp": 540,
            },
        ],
        "body_content": """# Vim 에디터 완전 정복

## Vim 기본 개념
Vim은 모달 에디터로, 일반 모드, 입력 모드, 비주얼 모드, 명령 모드라는 네 가지 기본 모드가 있습니다. 이 모드 전환 방식이 Vim의 핵심 철학입니다.

## 모션과 단축키
```
gg    - 파일 처음으로
G     - 파일 끝으로
/word - 단어 검색
*     - 커서 아래 단어 검색
```
f, t, w, b 같은 모션을 조합하면 원하는 위치로 순간 이동할 수 있습니다.

## 모드 이해하기
- 일반 모드: 키가 명령어로 동작
- 입력 모드: 텍스트 입력
- 비주얼 모드: 텍스트 선택
- 명령 모드: Ex 명령어 실행

## 실전 팁
`.` 명령어로 마지막 변경을 반복하는 것이 Vim 효율의 핵심입니다. 매크로(q)를 활용하면 반복 작업을 자동화할 수 있습니다.""",
        "related_contents": [],
    },
]
