import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layer — 정보",
  description: "Layer 플랫폼 안내 및 정책",
};

export default function InfoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}