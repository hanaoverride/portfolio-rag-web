import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page)] px-4 py-12">
      <div className="w-full max-w-md text-center animate-fade-in-up">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-0.5">
            <Image
              src="/logo.png"
              alt="Layer"
              width={140}
              height={44}
              className="mx-auto h-11 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-xl px-8 py-12">
          <p className="text-7xl font-bold gradient-text-primary font-display">404</p>
          <h1 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all duration-200 hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/30 active:scale-[0.98]"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}