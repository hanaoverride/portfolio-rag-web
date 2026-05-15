"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Eye, Clock } from "lucide-react";
import Link from "next/link";
import type { Content, TableOfContentsItem } from "@/lib/api/types";
import { VideoPlayer } from "@/components/content/VideoPlayer";
import RAGChatPanel from '@/components/content/RAGChatPanel';
import { TableOfContents } from "@/components/content/TableOfContents";
import { ArticleContent } from "@/components/content/ArticleContent";
import { CommentSection } from "@/components/content/CommentSection";
import { FloatingActionSidebar } from "@/components/content/FloatingActionSidebar";
import { useAuth, useBookmarks } from "@/lib/hooks";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatViews(views: number): string {
  if (views >= 10000) {
    return `${(views / 10000).toFixed(1)}만`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}천`;
  }
  return views.toString();
}

interface ContentDetailClientProps {
  content: Content;
}

export function ContentDetailClient({ content }: ContentDetailClientProps) {
  const [activeTimestamp, setActiveTimestamp] = useState<number | undefined>(undefined);
  const { isAuthenticated } = useAuth();
  const { bookmarkedIds, addBookmark, removeBookmark } = useBookmarks();
  const isBookmarked = bookmarkedIds.has(content.id);



  const handleBookmarkToggle = useCallback(async (contentId: string) => {
    if (!isAuthenticated) return;
    
    if (isBookmarked) {
      await removeBookmark(contentId);
    } else {
      await addBookmark(contentId);
    }
  }, [isAuthenticated, isBookmarked, addBookmark, removeBookmark]);

  const handleTocItemClick = (item: TableOfContentsItem) => {
    if (item.timestamp !== undefined && item.timestamp > 0) {
      setActiveTimestamp(item.timestamp);
      setTimeout(() => setActiveTimestamp(undefined), 100);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] transition-all duration-200 hover:text-primary-600 hover:-translate-x-0.5 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
          돌아가기
        </Link>

        <div className="mb-8">
          <h1 className="mb-4 text-2xl font-bold leading-tight text-[var(--color-text-primary)] sm:text-3xl font-display">
            {content.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg-surface)] px-3 py-1 border border-[var(--color-border)]">
              <Eye className="h-4 w-4" />
              {formatViews(content.views)}회
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg-surface)] px-3 py-1 border border-[var(--color-border)]">
              <Clock className="h-4 w-4" />
              {formatDuration(content.duration)}
            </span>
          </div>
        </div>

        <div className="mb-10 rounded-2xl overflow-hidden shadow-xl">
          <VideoPlayer
            videoUrl={content.videoUrl}
            startTime={activeTimestamp}
          />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <ArticleContent content={content} />

            <div className="mt-12 border-t border-[var(--color-border)] pt-8">
              <CommentSection contentId={content.id} />
            </div>
          </div>

          <aside className="hidden w-64 shrink-0 lg:block">
            <TableOfContents items={content.tableOfContents} onItemClick={handleTocItemClick} />
          </aside>
        </div>

        <div className="mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 shadow-sm">
          <RAGChatPanel contentId={content.id} contentTitle={content.title} />
        </div>
      </div>

      <FloatingActionSidebar
        contentId={content.id}
        isBookmarked={isBookmarked}
        onBookmarkToggle={handleBookmarkToggle}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
