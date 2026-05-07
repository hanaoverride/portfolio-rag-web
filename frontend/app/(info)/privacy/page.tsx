import Link from "next/link";

const privacySections = [
  {
    title: "제1조 (수집하는 개인정보)",
    content:
      "회사는 회원가입 및 서비스 이용을 위해 이메일 주소, 이름(닉네임), 비밀번호(암호화 저장)를 수집합니다. Google OAuth를 통한 로그인 시 Google 계정 식별 정보를 추가로 수집할 수 있습니다.",
  },
  {
    title: "제2조 (개인정보 이용 목적)",
    content:
      "수집한 개인정보는 회원 식별, 서비스 제공, 고객 지원, 서비스 개선을 위한 통계 분석 목적으로만 사용됩니다. 수집 목적 이외의 용도로는 사용하지 않습니다.",
  },
  {
    title: "제3조 (개인정보 보유 및 이용 기간)",
    content:
      "회원이 회원 탈퇴를 요청할 때까지 개인정보를 보유합니다. 탈퇴 시 지체 없이 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우는 예외로 합니다.",
  },
  {
    title: "제4조 (개인정보 제3자 제공)",
    content:
      "회사는 회원의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의거하거나 수사기관의 요청이 있는 경우는 예외로 합니다.",
  },
  {
    title: "제5조 (회원의 권리)",
    content:
      "회원은 언제든지 자신의 개인정보를 열람·수정·삭제할 수 있으며, 개인정보 처리에 대한 이의를 제기할 수 있습니다. 요청은 support@layer.dev로 문의해 주세요.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-0.5 text-primary-600 hover:text-primary-700 transition-colors duration-fast"
      >
        ← 홈으로
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">
        개인정보처리방침
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Layer는 회원의 개인정보를 소중히 다룹니다.
      </p>

      <div className="mt-8 space-y-4">
        {privacySections.map((section, index) => (
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
        본 방침은 포트폴리오 목적의 placeholder입니다. 실제 서비스 시 법적 검토를
        거친 방침으로 교체됩니다.
      </p>
    </>
  );
}