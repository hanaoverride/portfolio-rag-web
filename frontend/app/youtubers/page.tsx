"use client";

import { useEffect, useState, useCallback } from "react";
import { YoutuberGrid } from "@/components/youtubers/YoutuberGrid";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { getYoutubers } from "@/lib/api/youtubers";
import type { YouTuber } from "@/lib/api/types";

export default function YoutubersPage() {
  const [youtubers, setYoutubers] = useState<YouTuber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadYoutubers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getYoutubers({ limit: 100 }); // Get all for now
      setYoutubers(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "유튜버 목록을 불러오지 못했습니다");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadYoutubers();
  }, [loadYoutubers]);

  return (
    <main className="min-h-screen bg-[var(--color-bg-page)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <ErrorMessage
              title="데이터를 불러올 수 없습니다"
              message={error}
              onRetry={loadYoutubers}
            />
          </div>
        ) : (
          <YoutuberGrid
            youtubers={youtubers}
            title="유튜버 목록"
            description="당신에게 영감을 주는 최고의 콘텐츠 크리에이터들을 만나보세요."
          />
        )}
      </div>
    </main>
  );
}
