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

interface YoutuberCardProps {
  youtuber: YouTuber;
  className?: string;
  index?: number;
}

export function YoutuberCard({
  youtuber,
  className,
  index = 0,
}: YoutuberCardProps) {
  return (
    <Link
      href={youtuber.channelUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("group block", className)}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <article className="relative flex flex-col gap-5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 card-hover-lift hover:shadow-2xl hover:border-primary-200/50 dark:hover:border-primary-800/50 transition-all duration-500 overflow-hidden h-full">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-primary-400/5 blur-3xl group-hover:bg-primary-400/10 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-secondary-400/5 blur-3xl group-hover:bg-secondary-400/10 transition-all duration-700" />

        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-primary-50 dark:ring-primary-900/30 group-hover:ring-primary-200 dark:group-hover:ring-primary-700 transition-all duration-500 group-hover:scale-110 shadow-lg">
            <Image
              src={youtuber.avatar}
              alt={youtuber.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 font-display">
              {youtuber.name}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                구독자 {formatSubscribers(youtuber.subscribers)}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 text-center leading-relaxed relative z-10 min-h-[4.5rem]">
          {youtuber.description}
        </p>

        <div className="mt-auto pt-4 flex flex-wrap justify-center gap-2 relative z-10">
          {youtuber.categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-neutral-100/80 dark:bg-neutral-800/50 px-3 py-1 text-[11px] font-semibold text-[var(--color-text-secondary)] border border-transparent group-hover:border-primary-200/50 dark:group-hover:border-primary-800/50 transition-all duration-300 capitalize"
            >
              {cat.replace('-', ' ')}
            </span>
          ))}
          <span className="rounded-full bg-primary-50 dark:bg-primary-900/20 px-3 py-1 text-[11px] font-bold text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800/30">
            {youtuber.contentCount} 콘텐츠
          </span>
        </div>
      </article>
    </Link>
  );
}
