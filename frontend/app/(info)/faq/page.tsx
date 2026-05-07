import Link from "next/link";

const faqItems = [
  {
    question: "Layer는 어떤 서비스인가요?",
    answer:
      "Layer는 유튜브 영상을 텍스트로 변환하여 검색과 요약이 가능하게 만드는 플랫폼입니다. 영상 속 핵심 내용을 빠르게 파악하고 싶은 분들에게 유용합니다.",
  },
  {
    question: "AI 채팅은 어떻게 사용하나요?",
    answer:
      "콘텐츠 상세 페이지에서 AI 채팅 패널을 열면, 해당 영상의 내용에 대해 자유롭게 질문할 수 있습니다. 요약, 핵심 키워드 추출, 특정 구간 설명 등 다양한 질문이 가능합니다.",
  },
  {
    question: "북마크는 어디에서 확인하나요?",
    answer:
      "로그인 후 상단 내비게이션의 북마크 메뉴에서 저장한 콘텐츠를 확인할 수 있습니다. 카테고리별로 정리되어 빠르게 접근할 수 있습니다.",
  },
  {
    question: "회원가입 없이 이용할 수 있나요?",
    answer:
      "콘텐츠 둘러보기는 비회원도 가능합니다. 하지만 AI 채팅, 북마크, 댓글 등의 기능은 회원가입 후 이용할 수 있습니다.",
  },
  {
    question: "오류나 건의 사항은 어떻게 전달하나요?",
    answer:
      "문의하기 페이지를 통해 이메일로 문의해 주시면 빠르게 답변드리겠습니다. support@layer.dev로 직접 메일을 보내셔도 됩니다.",
  },
];

export default function FAQPage() {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-0.5 text-primary-600 hover:text-primary-700 transition-colors duration-fast"
      >
        ← 홈으로
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">
        자주 묻는 질문
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Layer 서비스에 대해 궁금한 점을 확인해 보세요.
      </p>

      <div className="mt-8 space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5"
          >
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              {item.question}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}