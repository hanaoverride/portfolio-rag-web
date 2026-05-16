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
        "views": 124500,
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
        "body_content": """# Bash 쉘 스크립트 100초 완벽 요약: 초보자부터 전문가까지

Bash(Bourne Again SHell)는 유닉스 계열 운영 체제에서 가장 널리 사용되는 명령어 셸이자 스크립트 언어입니다. 이 가이드에서는 터미널 자동화의 핵심인 Bash 스크립트의 모든 것을 빠르게 살펴봅니다.

## 1. Bash란 무엇인가?
Bash는 사용자가 입력하는 명령어를 운영체제가 이해할 수 있도록 전달하는 매개체입니다. 단순한 명령어 실행을 넘어, 복잡한 로직을 프로그래밍하여 시스템 작업을 자동화할 수 있습니다.

## 2. 변수와 데이터 타입
Bash에서는 변수를 선언할 때 공백 없이 `NAME="Antigravity"`와 같이 사용합니다. 변수를 참조할 때는 `$` 기호를 붙여 `$NAME`으로 사용하며, 문자열 보간 시에는 `${NAME}` 형식을 권장합니다.

```bash
# 변수 선언
GREETING="Hello"
USER_NAME=$(whoami)

# 출력
echo "${GREETING}, ${USER_NAME}!"
```

## 3. 조건문과 제어 구조
Bash의 조건문은 `[ ]` 또는 `[[ ]]`를 사용하여 평가합니다. `[[ ]]`는 더 현대적이고 강력한 기능을 제공합니다.

```bash
if [[ $1 == "admin" ]]; then
  echo "Welcome, Admin."
else
  echo "Access denied."
fi
```

## 4. 반복문 (Loops)
`for` 문과 `while` 문을 사용하여 반복 작업을 처리합니다.

```bash
# 파일 목록 출력
for file in *.txt; do
  echo "Processing $file..."
done
```

## 5. 파이프와 리다이렉션
명령어의 출력을 다른 명령어의 입력으로 보내는 파이프(`|`)와 파일로 저장하는 리다이렉션(`>`, `>>`)은 Bash의 꽃입니다.

## 결론
Bash 스크립트는 단순한 도구를 넘어 시스템 관리자와 개발자에게 필수적인 기술입니다. 이 100초 요약이 여러분의 자동화 여정에 도움이 되길 바랍니다.""",
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
        "views": 85600,
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
        "body_content": """# Go 언어 100초 완벽 정리: 클라우드 시대의 프로그래밍 언어

Go(또는 Golang)는 2007년 구글에서 개발한 정적 타입 컴파일 언어로, 단순함, 효율성, 그리고 강력한 동시성 지원을 목표로 설계되었습니다.

## 1. Go의 철학: 단순함이 곧 힘이다
Go는 복잡한 기능을 배제하고 학습 곡선을 최소화하는 데 집중합니다. 클래스 상속 대신 인터페이스와 구성을 사용하며, 예외 처리 대신 명시적인 에러 반환을 선호합니다.

## 2. 간결한 문법과 강력한 성능
C++만큼 빠르면서도 파이썬만큼 작성하기 쉽습니다. 가비지 컬렉션을 내장하고 있어 메모리 관리가 용이하며, 정적 컴파일을 통해 단일 바이너리 파일을 생성하므로 배포가 매우 간편합니다.

```go
package main

import "fmt"

func main() {
    message := "Hello, Gopher!"
    fmt.Println(message)
}
```

## 3. 고루틴(Goroutines)을 이용한 동시성
Go의 가장 큰 강점은 고루틴입니다. 수천 개의 고루틴을 아주 적은 메모리로 동시에 실행할 수 있으며, 채널(Channels)을 통해 데이터를 안전하게 공유합니다.

```go
go func() {
    fmt.Println("This runs concurrently!")
}()
```

## 4. 풍부한 표준 라이브러리
외부 프레임워크 없이도 강력한 HTTP 서버, JSON 파서, 암호화 라이브러리 등을 표준으로 제공합니다. 이는 프로젝트의 의존성을 줄이고 보안성을 높이는 데 기여합니다.

## 마치며
Docker, Kubernetes, Terraform 등 현대 클라우드 인프라의 핵심 도구들은 모두 Go로 작성되었습니다. 백엔드 개발자라면 반드시 익혀야 할 언어입니다.""",
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
        "views": 42300,
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
        "body_content": """# T3 Stack 완벽 가이드: 현대적인 풀스택 개발의 정점

T3 Stack은 "타입 안정성(Type-safety)"과 "개발자 경험(Developer Experience)"을 최우선으로 고려하는 개발 스택입니다. Theo가 주창한 이 스택은 엔드투엔드 타입 공유를 통해 런타임 에러를 획기적으로 줄여줍니다.

## 1. 구성 요소
- **Next.js**: 최고의 React 프레임워크
- **tRPC**: API 계층 없이 타입 안전한 통신 제공
- **Prisma**: 타입 안전한 ORM
- **Tailwind CSS**: 유틸리티 우선의 스타일링
- **NextAuth.js**: 간편한 인증 구현

## 2. tRPC: API 명세서가 필요 없는 세상
tRPC는 백엔드의 함수 타입을 프론트엔드에서 그대로 추론합니다. 백엔드에서 함수 인자를 변경하면 프론트엔드에서 즉시 컴파일 에러가 발생하여 실수를 방지합니다.

```typescript
// Backend
export const userRouter = router({
  getById: publicProcedure
    .input(z.string())
    .query(({ input }) => getUser(input)),
});

// Frontend
const user = trpc.user.getById.useQuery("id_123");
```

## 3. Prisma와 데이터베이스
Prisma 스키마 파일 하나로 데이터베이스 모델을 정의하고, 자동으로 타입 안전한 클라이언트를 생성합니다. SQL을 직접 작성하지 않고도 복잡한 쿼리를 타입 에러 없이 작성할 수 있습니다.

## 4. T3 Stack을 선택해야 하는 이유
규모가 커지는 프로젝트에서 타입 안정성은 생존의 문제입니다. T3 Stack은 초기 설정의 복잡함을 `create-t3-app`으로 해결하고, 유지보수가 쉬운 견고한 아키텍처를 제공합니다.""",
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
        "views": 28900,
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
        "body_content": """# TypeScript 사상 최대 업데이트 분석: 무엇이 변했는가?

TypeScript 팀은 최근 개발자들의 피드백을 수용하여 언어의 표현력과 생산성을 한 단계 높이는 대규모 업데이트를 발표했습니다. 이번 릴리스의 핵심 변경 사항을 분석해 봅니다.

## 1. 표준 ECMAScript 데코레이터 지원
드디어 TypeScript가 실험적 기능(experimentalDecorators)을 넘어 표준화된 ECMAScript 데코레이터를 정식 지원합니다. 이는 기존 프레임워크와의 호환성을 높이고 더 안정적인 메타프로그래밍을 가능하게 합니다.

## 2. const 타입 파라미터 (const Type Parameters)
제네릭 함수를 호출할 때 인자로 전달된 객체나 배열의 타입을 '리터럴 타입'으로 즉시 추론할 수 있게 되었습니다. 이전처럼 `as const`를 붙일 필요가 없어졌습니다.

```typescript
function routes<const T extends string[]>(args: T) {
  return args;
}

const r = routes(["home", "about"]); // readonly ["home", "about"] 타입으로 추론
```

## 3. 만족 연산자 (Satisfies Operator)
`satisfies` 연산자를 사용하면 객체가 특정 타입을 만족하는지 검사하면서도, 객체 자체의 구체적인 타입 정보는 유지할 수 있습니다. 이는 타입 검사와 유연성 사이의 완벽한 균형을 제공합니다.

## 4. 빌드 성능 향상
내부 알고리즘 최적화를 통해 대규모 프로젝트에서의 증분 빌드 속도가 최대 20% 향상되었습니다. 더 빠른 피드백 루프는 개발자 생산성에 직결됩니다.

## 마무리
이번 업데이트는 TypeScript가 단순한 'JS 위의 타입'을 넘어, 그 자체로 얼마나 성숙하고 강력한 언어로 진화하고 있는지를 보여줍니다.""",
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
        "views": 156000,
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
        "body_content": """# Neovim 처음부터 끝까지 설정하기: 0에서 IDE 부럽지 않은 환경까지

VS Code의 마우스 조작이 답답하게 느껴지시나요? Neovim은 개발자의 생각 속도에 맞춰 코드를 편집할 수 있게 해주는 최고의 텍스트 에디터입니다. 이 가이드에서는 기초부터 LSP 설정까지 완벽하게 정리합니다.

## 1. 왜 Neovim인가?
Neovim은 단순한 Vim의 개선판이 아닙니다. Lua를 제1언어로 채택하여 설정이 훨씬 쉽고 빠르며, 내장 LSP(Language Server Protocol) 지원을 통해 IDE 수준의 코드 인텔리전스를 제공합니다.

## 2. 패키지 매니저: lazy.nvim
현대적인 Neovim 설정의 시작은 `lazy.nvim`입니다. 플러그인을 선언적으로 관리하고 비동기로 로드하여 부팅 속도를 극대화합니다.

## 3. LSP 설정: 코딩의 지능을 더하다
`mason.nvim`과 `nvim-lspconfig`를 사용하여 각 언어에 맞는 언어 서버를 설치합니다. 자동 완성, 정의 이동, 심볼 검색 등이 완벽하게 작동하는 환경을 구축합니다.

```lua
-- LSP 설정 예시
require('lspconfig').tsserver.setup({})
require('lspconfig').pyright.setup({})
```

## 4. UI 커스터마이징
`telescope.nvim`으로 강력한 파일 검색 환경을 구축하고, `lualine`으로 세련된 상태 표시줄을 추가합니다. 여러분만의 개성 있는 테마를 적용해 보세요.

## 5. 포기하지 마세요!
초기 설정 과정은 험난할 수 있습니다. 하지만 이 과정을 통해 여러분은 자신의 도구를 완전히 이해하고 통제할 수 있게 됩니다. 자신만의 에디터를 만드는 여정은 그 자체로 즐거운 경험입니다.""",
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
        "views": 72100,
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
        "body_content": """# Vim 에디터 완전 정복: 입문자를 위한 필수 가이드

Vim은 모든 터미널에 내장된 강력한 에디터입니다. 초기 장벽은 높지만, 한번 익숙해지면 대체 불가능한 생산성을 보여줍니다. 이 가이드는 Vim의 핵심 모드와 조작법을 빠르게 전수합니다.

## 1. 모드 시스템의 이해 (The Modal Mindset)
Vim이 어려운 이유는 '입력'이 기본 상태가 아니기 때문입니다.
- **Normal Mode (Esc)**: 이동과 명령 실행 (기본 모드)
- **Insert Mode (i)**: 텍스트 입력
- **Visual Mode (v)**: 블록 선택
- **Command Mode (:)**: 저장, 종료, 설정

## 2. 효율적인 이동 (Motions)
마우스 없이 커서를 이동하는 법을 익히세요.
- `h`, `j`, `k`, `l`: 왼쪽, 아래, 위, 오른쪽
- `w`, `b`: 단어 단위 이동
- `0`, `$`: 행의 시작과 끝으로 이동

## 3. 강력한 명령의 조합 (Operators + Motions)
Vim은 언어처럼 동작합니다. `명령어 + 모션`의 조합으로 복잡한 동작을 수행합니다.
- `dw`: 단어 하나 삭제 (delete word)
- `y$`: 현재 위치부터 행 끝까지 복사 (yank to end)
- `ci"`: 쌍따옴표 안의 내용 수정 (change inside quotes)

## 4. 실전 생존 단축키
- `:w`: 저장
- `:q!`: 저장하지 않고 종료
- `u`: 실행 취소 (Undo)
- `Ctrl + r`: 다시 실행 (Redo)

## 마무리하며
Vim을 배우는 가장 좋은 방법은 `vimtutor`를 실행해 보는 것입니다. 매일 조금씩 명령어를 늘려가며 손가락이 기억하게 만드세요. 어느 순간 마우스를 잡는 것이 어색해질 것입니다.""",
        "related_contents": [],
    },
]
