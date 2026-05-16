"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUpDown, Clock, Eye, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentCard } from "@/components/common/ContentCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { getContentsByCategory } from "@/lib/api/contents";
import { useBookmarks, useAuth } from "@/lib/hooks";
import type { Content } from "@/lib/api/types";

type SortOption = "latest" | "popular" | "views";

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: "latest", label: "최신순", icon: <Clock className="h-4 w-4" /> },
  { value: "popular", label: "인기순", icon: <TrendingUp className="h-4 w-4" /> },
  { value: "views", label: "조회수순", icon: <Eye className="h-4 w-4" /> },
];

const PAGE_SIZE = 12;

function sortContents(contents: Content[], sort: SortOption): Content[] {
  const sorted = [...contents];
  switch (sort) {
    case "latest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "popular":
      return sorted.sort((a, b) => b.views - a.views);
    case "views":
      return sorted.sort((a, b) => b.views - a.views);
    default:
      return sorted;
  }
}

interface Props {
  slug: string;
  categoryName: string;
}

export default function CategoryPageClient({ slug, categoryName }: Props) {
  const [contents, setContents] = useState<Content[]>([]);
  const [total, setTotal] = useState(0);
  const { isAuthenticated } = useAuth();
  const { bookmarkedIds, addBookmark, removeBookmark } = useBookmarks();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("views");
  const [offset, setOffset] = useState(0);



  const handleBookmarkToggle = useCallback(async (contentId: string) => {
    if (!isAuthenticated) return;
    const isCurrentlyBookmarked = bookmarkedIds.has(contentId);
    if (isCurrentlyBookmarked) {
      await removeBookmark(contentId);
    } else {
      await addBookmark(contentId);
    }
  }, [isAuthenticated, addBookmark, removeBookmark, bookmarkedIds]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const contentsResult = await getContentsByCategory(slug, { limit: PAGE_SIZE, offset });
      setContents(contentsResult.items);
      setTotal(contentsResult.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : "콘텐츠를 불러오지 못했습니다";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [slug, offset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedContents = sortContents(contents, sort);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  if (isLoading && contents.length === 0) {
    return (
      <>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  if (error && contents.length === 0) {
    return (
      <>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ErrorMessage
            title="카테고리를 불러올 수 없습니다"
            message={error}
            onRetry={fetchData}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Category Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary-100 to-primary-50 px-4 py-1 text-sm font-semibold text-primary-700 dark:from-primary-900/30 dark:to-primary-900/20 dark:text-primary-300">
              카테고리
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] font-display">
            {categoryName}
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            총 <span className="font-semibold text-primary-600">{total}</span>개의 콘텐츠
          </p>
        </div>

        {/* Sort Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-1.5 shadow-sm">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSort(option.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                  sort === option.value
                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-page)] hover:text-[var(--color-text-primary)]"
                )}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>

          <span className="text-sm text-[var(--color-text-muted)]">
            {total}개 중 {offset + 1}-{Math.min(offset + PAGE_SIZE, total)}
          </span>
        </div>

        {/* Content Grid */}
        {sortedContents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedContents.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                isAuthenticated={isAuthenticated}
                isBookmarked={bookmarkedIds.has(content.id)}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-page)] mb-5">
              <ArrowUpDown className="h-8 w-8 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              콘텐츠가 없습니다
            </h3>
            <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
              이 카테고리에 아직 등록된 콘텐츠가 없습니다.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="페이지 탐색">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              className={cn(
                "inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                currentPage <= 1
                  ? "cursor-not-allowed text-[var(--color-text-muted)] opacity-50"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)] hover:shadow-sm"
              )}
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setOffset((page - 1) * PAGE_SIZE)}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200",
                  page === currentPage
                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)] hover:shadow-sm"
                )}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setOffset(offset + PAGE_SIZE)}
              className={cn(
                "inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                currentPage >= totalPages
                  ? "cursor-not-allowed text-[var(--color-text-muted)] opacity-50"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)] hover:shadow-sm"
              )}
            >
              다음
            </button>
          </nav>
        )}
      </div>
    </>
  );
}
