"use client";

import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/api/types";
import { getCategories } from "@/lib/api/categories";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShellInner({ children }: AppShellProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!mounted) return;
    getCategories().then(setCategories).catch(() => {});
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-page)]">
      <Header
        categories={categories}
        onCategorySelect={(cat: Category) => router.push(`/category/${cat.slug}`)}
        onSearch={(query: string) => router.push(`/search?q=${encodeURIComponent(query)}`)}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
