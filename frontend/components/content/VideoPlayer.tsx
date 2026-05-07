"use client";

import { useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

interface VideoPlayerProps {
  videoUrl: string;
  startTime?: number;
  className?: string;
}

export function VideoPlayer({ videoUrl, startTime, className }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const videoId = useMemo(() => extractYouTubeId(videoUrl), [videoUrl]);

  const embedUrl = useMemo(() => {
    if (!videoId) return null;
    const params = new URLSearchParams();
    params.set("rel", "0");
    if (startTime && startTime > 0) {
      params.set("start", String(Math.floor(startTime)));
    }
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, startTime]);

  if (!videoId || hasError) {
    return (
      <div
        className={cn(
          "flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl bg-neutral-100 dark:bg-neutral-800",
          className
        )}
      >
        <AlertCircle className="h-10 w-10 text-[var(--color-text-muted)]" />
        <p className="text-sm text-[var(--color-text-secondary)]">
          {hasError ? "영상을 불러올 수 없습니다" : "유효하지 않은 영상 주소입니다"}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden rounded-xl", className)}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-[var(--color-text-secondary)]">영상 로딩 중...</p>
          </div>
        </div>
      )}

      <iframe
        src={embedUrl!}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}