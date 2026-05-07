import Link from "next/link";

const termsSections = [
  {
    title: "제1조 (목적)",
    content:
      "본 약관은 Layer(이하 '회사')가 제공하는 영상-텍스트 변환 플랫폼 서비스의 이용 조건 및 절차, 회사와 회원의 권리·의무 등을 규정함을 목적으로 합니다.",
  },
  {
    title: "제2조 (정의)",
    content:
      "① '서비스'란 회사가 제공하는 영상 텍스트 변환, AI 채팅, 북마크 등의 모든 기능을 의미합니다. ② '회원'이란 본 약관에 동의하고 회사와 이용 계약을 체결한 자를 의미합니다.",
  },
  {
    title: "제3조 (서비스 제공)",
    content:
      "회사는 회원에게 콘텐츠 탐색, AI 기반 질의응답, 북마크 및 댓글 기능 등을 제공합니다. 서비스의 세부 내용은 변경될 수 있으며, 변경 시 사전 공지합니다.",
  },
  {
    title: "제4조 (회원 의무)",
    content:
      "회원은 본 약관 및 관련 법령을 준수하여야 하며, 타인의 권리를 침해하는 행위, 서비스 운영을 방해하는 행위 등을 하여서는 안 됩니다.",
  },
  {
    title: "제5조 (지적재산권)",
    content:
      "서비스 내 제공되는 콘텐츠 및 AI 생성 결과물의 저작권은 원 권리자에게 귀속됩니다. 회원은 서비스를 통해 얻은 정보를 영리 목적으로 복제·배포할 수 없습니다.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-0.5 text-primary-600 hover:text-primary-700 transition-colors duration-fast"
      >
        ← 홈으로
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">
        이용약관
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Layer 서비스 이용약관입니다.
      </p>

      <div className="mt-8 space-y-4">
        {termsSections.map((section, index) => (
          <div
            key={index}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5"
          >
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-[var(--color-text-muted)]">
        본 약관은 포트폴리오 목적의 placeholder입니다. 실제 서비스 시 법적 검토를
        거친 약관으로 교체됩니다.
      </p>
    </>
  );
}