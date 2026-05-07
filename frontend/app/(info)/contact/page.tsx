import Link from "next/link";
import { Mail } from "lucide-react";

const contactChannels = [
  {
    label: "이메일",
    value: "support@layer.dev",
    description: "일반 문의 및 버그 리포트",
  },
  {
    label: "응답 시간",
    value: "영업일 기준 1–2일",
    description: "빠른 시일 내에 답변드리겠습니다",
  },
];

export default function ContactPage() {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-0.5 text-primary-600 hover:text-primary-700 transition-colors duration-fast"
      >
        ← 홈으로
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">
        문의하기
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        궁금한 점이나 건의 사항이 있으시면 아래 연락처로 문의해 주세요.
      </p>

      <div className="mt-8 space-y-4">
        {contactChannels.map((channel) => (
          <div
            key={channel.label}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5"
          >
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {channel.label}
            </p>
            <p className="mt-1 text-base text-primary-600">{channel.value}</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {channel.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary-600" />
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
            이메일로 문의하기
          </h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          문의 사항은{" "}
          <a
            href="mailto:support@layer.dev"
            className="text-primary-600 hover:text-primary-700 underline transition-colors duration-fast"
          >
            support@layer.dev
          </a>
          로 보내주세요. 서비스 이용 중 발생한 오류, 기능 건의, 협업 제안 등
          모든 문의를 환영합니다.
        </p>
      </div>
    </>
  );
}