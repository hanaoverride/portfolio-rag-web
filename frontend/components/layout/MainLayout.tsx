import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { Category } from "@/lib/api/types";

interface MainLayoutProps {
  children: React.ReactNode;
  categories?: Category[];
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: Category) => void;
  className?: string;
}

export function MainLayout({
  children,
  categories,
  onSearch,
  onCategorySelect,
  className,
}: MainLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-[var(--color-bg-page)]", className)}>
      <Header
        categories={categories}
        onSearch={onSearch}
        onCategorySelect={onCategorySelect}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}