"use client";

import { useEffect, useCallback } from "react";
import { ContentGrid } from "@/components/home/ContentGrid";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useContents } from "@/lib/hooks/useContents";
import { useBookmarks, useAuth } from "@/lib/hooks";

export default function NewPage() {
  const { contents, isLoading, error, fetchContents, clearError } = useContents();
  const { isAuthenticated } = useAuth();
  const { bookmarkedIds, addBookmark, removeBookmark } = useBookmarks();

  useEffect(() => {
    fetchContents({ isNew: true, limit: 20 });
  }, [fetchContents]);

  const handleRetry = useCallback(() => {
    clearError();
    fetchContents({ isNew: true, limit: 20 });
  }, [clearError, fetchContents]);

  const handleBookmarkToggle = useCallback(async (contentId: string) => {
    if (!isAuthenticated) return;
    const isCurrentlyBookmarked = bookmarkedIds.has(contentId);
    if (isCurrentlyBookmarked) {
      await removeBookmark(contentId);
    } else {
      await addBookmark(contentId);
    }
  }, [isAuthenticated, addBookmark, removeBookmark, bookmarkedIds]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl font-display">
          최신 콘텐츠
        </h1>
        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
          새롭게 업로드된 최신 콘텐츠를 가장 먼저 만나보세요.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : error ? (
        <ErrorMessage
          title="콘텐츠를 불러올 수 없습니다"
          message={error}
          onRetry={handleRetry}
        />
      ) : (
        <ContentGrid
          contents={contents}
          isAuthenticated={isAuthenticated}
          bookmarkedIds={bookmarkedIds}
          onBookmarkToggle={handleBookmarkToggle}
        />
      )}
    </div>
  );
}
