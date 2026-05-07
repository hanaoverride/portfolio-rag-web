"use client";

import { useState, useCallback, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, XCircle } from "lucide-react";
import { ContentCard } from "@/components/common/ContentCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useContents, useBookmarks, useAuth } from "@/lib/hooks";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState(query);
  const { contents, total, isLoading, error, searchContents, clearError } = useContents();
  const { isAuthenticated } = useAuth();
  const { bookmarkedIds, addBookmark, removeBookmark } = useBookmarks();



  useEffect(() => {
    if (query.trim()) {
      searchContents(query.trim());
    }
  }, [query, searchContents]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [inputValue, router]
  );

  const handleBookmarkToggle = useCallback(async (contentId: string) => {
    if (!isAuthenticated) return;
    const isCurrentlyBookmarked = bookmarkedIds.has(contentId);
    if (isCurrentlyBookmarked) {
      await removeBookmark(contentId);
    } else {
      await addBookmark(contentId);
    }
  }, [isAuthenticated, addBookmark, removeBookmark, bookmarkedIds]);

  const handleClear = useCallback(() => {
    setInputValue("");
    router.push("/search");
    clearError();
  }, [router, clearError]);

  return (
    <>
      <div className="mb-10">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] font-display section-title-decoration">
          검색
        </h1>
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-5 py-3.5 shadow-sm transition-all duration-300 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-400/20 focus-within:shadow-lg">
            <Search className="h-5 w-5 shrink-0 text-[var(--color-text-muted)]" />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="검색어를 입력하세요..."
              className="flex-1 bg-transparent text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
              autoFocus
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="shrink-0 text-[var(--color-text-muted)] transition-all duration-200 hover:text-[var(--color-text-secondary)] hover:scale-110"
                aria-label="검색어 지우기"
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!isLoading && error && (
        <ErrorMessage
          title="검색 중 오류가 발생했습니다"
          message={error}
          onRetry={() => searchContents(query.trim())}
        />
      )}

      {!isLoading && !error && query.trim() && contents.length > 0 && (
        <>
          <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
            <span className="font-semibold text-primary-600">{total}</span>개의 검색 결과 — &quot;{query}&quot;
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contents.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                isAuthenticated={isAuthenticated}
                isBookmarked={bookmarkedIds.has(content.id)}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        </>
      )}

      {!isLoading && !error && query.trim() && contents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-page)] mb-5">
            <Search className="h-8 w-8 text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            검색 결과가 없습니다
          </h3>
          <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
            다른 검색어로 다시 시도해보세요.
          </p>
        </div>
      )}

      {!query.trim() && !isLoading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-page)] mb-5">
            <Search className="h-8 w-8 text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            검색어를 입력하세요
          </h3>
          <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
            영상 제목, 작성자, 카테고리 등으로 검색할 수 있습니다.
          </p>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center"><LoadingSpinner size="lg" /></div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}