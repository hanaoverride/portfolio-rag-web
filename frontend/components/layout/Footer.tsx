import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "서비스",
    links: [
      { label: "콘텐츠 둘러보기", href: "/contents" },
      { label: "인기 콘텐츠", href: "/trending" },
      { label: "최신 콘텐츠", href: "/new" },
    ],
  },
  {
    title: "유튜버",
    links: [
      { label: "유튜버 목록", href: "/youtubers" },
    ],
  },
  {
    title: "고객지원",
    links: [
      { label: "자주 묻는 질문", href: "/faq" },
      { label: "문의하기", href: "/contact" },
      { label: "공지사항", href: "/notices" },
    ],
  },
  {
    title: "법적 고지",
    links: [
      { label: "이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy" },
      { label: "쿠키 정책", href: "/cookies" },
    ],
  },
];

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]",
        className
      )}
    >
      {/* Subtle gradient accent at top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase text-[var(--color-text-primary)]">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-text-secondary)] transition-all duration-200 hover:text-primary-500 hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-[var(--color-border)] pt-8 sm:flex-row sm:justify-between">
          <Link href="/" className="group flex items-center gap-1">
            <Image
              src="/logo.png"
              alt="Layer"
              width={90}
              height={28}
              className="h-7 w-auto transition-opacity duration-200 group-hover:opacity-80"
            />
          </Link>
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Layer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}