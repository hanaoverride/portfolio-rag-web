"use client";

import { useEffect, useState, useCallback } from "react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ContentGrid } from "@/components/home/ContentGrid";
import { RecommendedYouTubers } from "@/components/home/RecommendedYouTubers";
import { Statistics } from "@/components/home/Statistics";
import { LatestContent } from "@/components/home/LatestContent";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useContents } from "@/lib/hooks/useContents";
import { useBookmarks, useAuth } from "@/lib/hooks";
import { getYoutubers } from "@/lib/api/youtubers";
import type { YouTuber } from "@/lib/api/types";

export default function HomePage() {
  const { contents, isLoading: contentsLoading, error: contentsError, fetchContents, clearError } = useContents();
  const { isAuthenticated } = useAuth();
  const { bookmarkedIds, addBookmark, removeBookmark } = useBookmarks();
  const [youtubers, setYoutubers] = useState<YouTuber[]>([]);
  const [ytLoading, setYtLoading] = useState(true);
  const [ytError, setYtError] = useState<string | null>(null);

  useEffect(() => {
    fetchContents({ limit: 10 });
  }, [fetchContents]);



  useEffect(() => {
    let cancelled = false;
    async function loadYoutubers() {
      try {
        setYtLoading(true);
        setYtError(null);
        const result = await getYoutubers({ limit: 8 });
        if (!cancelled) {
          setYoutubers(result.items);
        }
      } catch (err) {
        if (!cancelled) {
          setYtError(err instanceof Error ? err.message : "유튜버 목록을 불러오지 못했습니다");
        }
      } finally {
        if (!cancelled) {
          setYtLoading(false);
        }
      }
    }
    loadYoutubers();
    return () => { cancelled = true; };
  }, []);

  const handleRetryContents = useCallback(() => {
    clearError();
    fetchContents({ limit: 10 });
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

  const handleRetryYoutubers = useCallback(async () => {
    try {
      setYtError(null);
      setYtLoading(true);
      const result = await getYoutubers({ limit: 8 });
      setYoutubers(result.items);
    } catch (err) {
      setYtError(err instanceof Error ? err.message : "유튜버 목록을 불러오지 못했습니다");
    } finally {
      setYtLoading(false);
    }
  }, []);

  const featuredContents = contents.slice(0, 4);
  const latestContents = [...contents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-16">
        {contentsLoading ? (
          <LoadingSpinner size="lg" className="py-20" />
        ) : contentsError ? (
          <ErrorMessage
            title="콘텐츠를 불러올 수 없습니다"
            message={contentsError}
            onRetry={handleRetryContents}
          />
        ) : featuredContents.length > 0 ? (
          <HeroSlider contents={featuredContents} />
        ) : null}

        {contentsLoading ? (
          <LoadingSpinner size="lg" className="py-10" />
        ) : contentsError ? null : (
          contents.length > 4 && (
            <ContentGrid
              contents={contents.slice(4)}
              title="콘텐츠 둘러보기"
              isAuthenticated={isAuthenticated}
              bookmarkedIds={bookmarkedIds}
              onBookmarkToggle={handleBookmarkToggle}
            />
          )
        )}

        {ytLoading ? (
          <LoadingSpinner size="lg" className="py-10" />
        ) : ytError ? (
          <ErrorMessage
            title="유튜버 목록을 불러올 수 없습니다"
            message={ytError}
            onRetry={handleRetryYoutubers}
          />
        ) : (
          <RecommendedYouTubers youtubers={youtubers} />
        )}

        <Statistics />

        {contentsLoading ? (
          <LoadingSpinner size="lg" className="py-10" />
        ) : contentsError ? null : (
          latestContents.length > 0 && (
            <LatestContent
              contents={latestContents}
              isAuthenticated={isAuthenticated}
              bookmarkedIds={bookmarkedIds}
              onBookmarkToggle={handleBookmarkToggle}
            />
          )
        )}
      </div>
    </div>
  );
}