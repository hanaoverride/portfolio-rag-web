"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { YouTuber } from "@/lib/api/types";

function formatSubscribers(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}만`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}천`;
  }
  return count.toString();
}

interface RecommendedYouTubersProps {
  youtubers: YouTuber[];
  className?: string;
}

export function RecommendedYouTubers({
  youtubers,
  className,
}: RecommendedYouTubersProps) {
  if (youtubers.length === 0) return null;

  return (
    <section className={cn("w-full", className)}>
      <h2 className="mb-8 text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl section-title-decoration font-display">
        추천 유튜버
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:overflow-visible sm:gap-5">
        {youtubers.map((yt, idx) => (
          <Link
            key={yt.id}
            href={yt.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-shrink-0 w-[200px] sm:w-auto"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <article className="relative flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 card-hover-lift hover:shadow-xl hover:border-primary-200/50 dark:hover:border-primary-800/50 transition-all duration-300 overflow-hidden">
              {/* Subtle glow behind avatar */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-primary-400/10 blur-xl group-hover:bg-primary-400/20 transition-all duration-500" />

              <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-primary-100 dark:ring-primary-800/50 group-hover:ring-primary-300 dark:group-hover:ring-primary-600 transition-all duration-300 group-hover:scale-105">
                <Image
                  src={yt.avatar}
                  alt={yt.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="relative text-center">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-1">
                  {yt.name}
                </h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  구독자 {formatSubscribers(yt.subscribers)}
                </p>
              </div>
              {yt.categories.length > 0 && (
                <div className="relative flex flex-wrap justify-center gap-1.5">
                  {yt.categories.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-primary-50/80 px-2.5 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-900/25 dark:text-primary-300"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}