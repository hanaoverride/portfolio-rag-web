"use client";

import { cn } from "@/lib/utils";
import { YoutuberCard } from "./YoutuberCard";
import type { YouTuber } from "@/lib/api/types";

interface YoutuberGridProps {
  youtubers: YouTuber[];
  title?: string;
  description?: string;
  className?: string;
}

export function YoutuberGrid({
  youtubers,
  title,
  description,
  className,
}: YoutuberGridProps) {
  if (youtubers.length === 0) return null;

  return (
    <section className={cn("w-full py-12", className)}>
      {(title || description) && (
        <div className="mb-12 space-y-4">
          {title && (
            <h2 className="text-3xl font-black text-[var(--color-text-primary)] sm:text-4xl font-display section-title-decoration">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-2xl text-lg text-[var(--color-text-secondary)] leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up">
        {youtubers.map((youtuber, idx) => (
          <YoutuberCard
            key={youtuber.id}
            youtuber={youtuber}
            index={idx}
          />
        ))}
      </div>
    </section>
  );
}
