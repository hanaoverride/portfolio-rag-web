import Link from "next/link";

const cookieSections = [
  {
    title: "1. 쿠키란 무엇인가요?",
    content:
      "쿠키는 웹사이트를 방문할 때 사용자의 컴퓨터나 모바일 기기에 저장되는 작은 텍스트 파일입니다. 쿠키는 웹사이트가 사용자의 동작이나 기본 설정(로그인, 언어 등)을 일정 기간 동안 기억할 수 있게 하여, 사용자가 사이트를 다시 방문하거나 페이지를 이동할 때마다 설정을 다시 입력할 필요가 없도록 도와줍니다.",
  },
  {
    title: "2. Layer에서 사용하는 쿠키의 종류",
    content:
      "우리는 서비스 제공을 위해 다음과 같은 쿠키를 사용합니다:\n- 필수 쿠키: 사용자가 웹사이트를 탐색하고 기능을 사용하는 데 꼭 필요합니다. 예를 들어, 로그인 상태를 유지하고 보안 기능을 수행하는 데 사용됩니다.\n- 분석 쿠키: 사용자가 웹사이트를 어떻게 이용하는지 이해하고, 서비스의 성능을 개선하는 데 도움을 줍니다.",
  },
  {
    title: "3. 쿠키 설정 및 관리",
    content:
      "사용자는 브라우저 설정을 통해 쿠키를 거부하거나 기존 쿠키를 삭제할 수 있습니다. 대부분의 웹 브라우저는 자동으로 쿠키를 허용하지만, 원하실 경우 브라우저 설정을 변경하여 쿠키를 제어할 수 있습니다. 다만, 쿠키를 비활성화할 경우 서비스의 일부 기능이 정상적으로 작동하지 않을 수 있습니다.",
  },
  {
    title: "4. 쿠키 정책의 변경",
    content:
      "본 쿠키 정책은 서비스의 변경 사항이나 법적 요구 사항에 따라 업데이트될 수 있습니다. 변경 사항이 있을 경우 웹사이트를 통해 공지하며, 업데이트된 정책은 게시 즉시 효력이 발생합니다.",
  },
];

export default function CookiesPage() {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-0.5 text-primary-600 hover:text-primary-700 transition-colors duration-fast"
      >
        ← 홈으로
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">
        쿠키 정책
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Layer 서비스에서 사용되는 쿠키에 대해 안내드립니다.
      </p>

      <div className="mt-8 space-y-4">
        {cookieSections.map((section, index) => (
          <div
            key={index}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5"
          >
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)] whitespace-pre-line">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-[var(--color-text-muted)]">
        본 쿠키 정책은 포트폴리오 목적의 견본입니다. 실제 서비스 운영 시에는 관련
        법규에 따른 상세 정책을 수립해야 합니다.
      </p>
    </>
  );
}
