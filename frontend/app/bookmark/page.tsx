"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentCard } from "@/components/common/ContentCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FormattedDate } from "@/components/common/FormattedDate";
import { useBookmarks } from "@/lib/hooks";

const PAGE_SIZE = 12;

export default function BookmarkPage() {
  const [offset, setOffset] = useState(0);
  const { bookmarks, total, isLoading, error, fetchBookmarks, removeBookmark } =
    useBookmarks();

  useEffect(() => {
    fetchBookmarks({ limit: PAGE_SIZE, offset });
  }, [fetchBookmarks, offset]);

  const handleRemoveBookmark = useCallback(
    async (contentId: string) => {
      await removeBookmark(contentId);
    },
    [removeBookmark]
  );

  const handleClearAll = useCallback(async () => {
    const ids = bookmarks.map((b) => b.content.id);
    for (const id of ids) {
      await removeBookmark(id);
    }
  }, [bookmarks, removeBookmark]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  if (isLoading && bookmarks.length === 0) {
    return (
      <>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  if (error && bookmarks.length === 0) {
    return (
      <>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ErrorMessage
            title="북마크를 불러올 수 없습니다"
            message={error}
            onRetry={fetchBookmarks}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] font-display section-title-decoration">
              북마크
            </h1>
            <p className="mt-3 text-[var(--color-text-secondary)]">
              저장한 콘텐츠 <span className="font-semibold text-primary-600">{total}</span>개
            </p>
          </div>
          {bookmarks.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 rounded-full border border-error/20 px-5 py-2 text-sm font-medium text-error transition-all duration-200 hover:bg-error/5 active:scale-[0.98]"
            >
              <Trash2 className="h-4 w-4" />
              전체 삭제
            </button>
          )}
        </div>

        {bookmarks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((bookmarked) => (
                <div key={bookmarked.content.id} className="relative">
                  <ContentCard
                    content={bookmarked.content}
                    isBookmarked
                    onBookmarkToggle={handleRemoveBookmark}
                  />
                  <span className="mt-2 block text-xs text-[var(--color-text-muted)]">
                    저장일: <FormattedDate date={bookmarked.bookmarkedAt} />
                  </span>
                </div>
              ))}
            </div>

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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-page)] mb-5">
              <Bookmark className="h-8 w-8 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              북마크가 없습니다
            </h3>
            <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
              관심 있는 콘텐츠를 북마크하면 여기서 확인할 수 있습니다.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all duration-200 hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/30 active:scale-[0.98]"
            >
              콘텐츠 둘러보기
            </Link>
          </div>
        )}
      </div>
    </>
  );
}