"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionSidebarProps {
  contentId?: string;
  isBookmarked?: boolean;
  onBookmarkToggle?: (contentId: string) => void;
  isAuthenticated?: boolean;
  className?: string;
}

export function FloatingActionSidebar({
  contentId,
  isBookmarked = false,
  onBookmarkToggle,
  isAuthenticated = false,
  className,
}: FloatingActionSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToComments = () => {
    const el = document.getElementById("comments");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-40 flex flex-col gap-3 transition-all duration-normal",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none",
        className
      )}
    >
      {isAuthenticated && contentId && (
        <button
          type="button"
          onClick={() => onBookmarkToggle?.(contentId)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-fast focus-visible:outline-2 focus-visible:outline-offset-2",
            isBookmarked
              ? "bg-primary-600 text-white hover:bg-primary-700 focus-visible:outline-primary-500"
              : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-neutral-100 dark:hover:bg-neutral-800"
          )}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-5 w-5" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </button>
      )}

      <button
        type="button"
        onClick={scrollToComments}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] shadow-lg transition-all duration-fast hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        aria-label="댓글로 이동"
      >
        <MessageSquare className="h-5 w-5" />
      </button>
    </div>
  );
}