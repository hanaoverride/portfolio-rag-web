"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { TableOfContentsItem } from "@/lib/api/types";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  onItemClick?: (item: TableOfContentsItem) => void;
  className?: string;
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TableOfContents({ items, onItemClick, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  const handleScrollSpy = useCallback(() => {
    for (let i = items.length - 1; i >= 0; i--) {
      const el = document.getElementById(items[i].id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          setActiveId(items[i].id);
          return;
        }
      }
    }
    if (items.length > 0) {
      setActiveId(items[0].id);
    }
  }, [items]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [handleScrollSpy]);

  const handleClick = (item: TableOfContentsItem) => {
    const el = document.getElementById(item.id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    onItemClick?.(item);
  };

  if (items.length === 0) return null;

  return (
    <nav
      className={cn(
        "sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4",
        className
      )}
      aria-label="목차"
    >
      <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
        목차
      </h2>
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const indentClass =
            item.level === 1
              ? "pl-0"
              : item.level === 2
                ? "pl-4"
                : "pl-8";

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleClick(item)}
                className={cn(
                  "flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors duration-fast",
                  indentClass,
                  isActive
                    ? "bg-primary-50 font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                    : "text-[var(--color-text-secondary)] hover:bg-neutral-50 hover:text-[var(--color-text-primary)] dark:hover:bg-neutral-800"
                )}
              >
                {item.emoji && <span className="shrink-0">{item.emoji}</span>}
                <span className="line-clamp-2">{item.title}</span>
                {item.timestamp != null && (
                  <span className="ml-auto shrink-0 text-xs text-[var(--color-text-muted)]">
                    {formatTimestamp(item.timestamp)}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}