"use client";

import { cn } from "@/lib/utils";
import { ContentCard } from "@/components/common/ContentCard";
import type { Content } from "@/lib/api/types";

interface ContentGridProps {
  contents: Content[];
  title?: string;
  className?: string;
  isAuthenticated?: boolean;
  bookmarkedIds?: Set<string>;
  onBookmarkToggle?: (contentId: string) => void;
}

export function ContentGrid({
  contents,
  title,
  className,
  isAuthenticated,
  bookmarkedIds,
  onBookmarkToggle,
}: ContentGridProps) {
  if (contents.length === 0) return null;

  return (
    <section className={cn("w-full", className)}>
      {title && (
        <h2 className="mb-8 text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl section-title-decoration font-display">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {contents.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            isAuthenticated={isAuthenticated}
            isBookmarked={bookmarkedIds?.has(content.id) ?? false}
            onBookmarkToggle={onBookmarkToggle}
          />
        ))}
      </div>
    </section>
  );
}