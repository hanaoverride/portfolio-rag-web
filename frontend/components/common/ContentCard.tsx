"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  Clock,
  Eye,
} from "lucide-react";
import { cn, formatViews } from "@/lib/utils";
import type { Content } from "@/lib/api/types";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}



interface ContentCardProps {
  content: Content;
  onBookmarkToggle?: (contentId: string) => void;
  isBookmarked?: boolean;
  isAuthenticated?: boolean;
  className?: string;
}

export function ContentCard({
  content,
  onBookmarkToggle,
  isBookmarked = false,
  isAuthenticated,
  className,
}: ContentCardProps) {
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(content.id);
  };

  return (
    <Link href={`/content/${content.id}`} className={cn("group block", className)}>
      <article className="overflow-hidden rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] card-hover-lift hover:shadow-xl hover:border-primary-200/50 dark:hover:border-primary-800/50 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={content.thumbnail}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Duration badge */}
          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Clock className="h-3 w-3" />
            {formatDuration(content.duration)}
          </span>

          {/* NEW badge */}
          {content.isNew && (
            <span className="absolute top-2.5 left-2.5 rounded-lg bg-gradient-to-r from-accent-500 to-accent-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md shadow-accent-500/30">
              NEW
            </span>
          )}

          {/* Bookmark button */}
          {isAuthenticated !== false && (
            <button
              type="button"
              onClick={handleBookmark}
              className={cn(
                "absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
                isBookmarked
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-100"
                  : "bg-black/30 text-white/80 backdrop-blur-md hover:bg-black/50 hover:text-white opacity-0 group-hover:opacity-100"
              )}
              aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2.5 flex items-center gap-2.5">
            <Image
              src={content.author.avatar}
              alt={content.author.name}
              width={28}
              height={28}
              className="rounded-full object-cover ring-2 ring-[var(--color-border)]"
            />
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              {content.author.name}
            </span>
          </div>

          <h3 className="mb-2.5 line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--color-text-primary)] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {content.title}
          </h3>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {content.category.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="inline-block rounded-full bg-primary-50/80 px-2.5 py-0.5 text-[11px] font-semibold text-primary-700 dark:bg-primary-900/25 dark:text-primary-300"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <Eye className="h-3.5 w-3.5" />
            <span>{formatViews(content.views)}회</span>
          </div>
        </div>
      </article>
    </Link>
  );
}