"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Content } from "@/lib/api/types";

interface HeroSliderProps {
  contents: Content[];
  className?: string;
}

const AUTOPLAY_INTERVAL = 5000;

export function HeroSlider({ contents, className }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = contents.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(current + 1), [goTo, current]);
  const goPrev = useCallback(() => goTo(current - 1), [goTo, current]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [goNext, total, paused]);

  if (total === 0) return null;

  return (
    <section
      className={cn("relative w-full overflow-hidden rounded-3xl shadow-2xl", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="추천 콘텐츠"
    >
      <div className="relative h-[320px] sm:h-[420px] md:h-[500px]">
        {contents.map((content, idx) => (
          <Link
            key={content.id}
            href={`/content/${content.id}`}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-out",
              idx === current ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-[1.02]"
            )}
            aria-hidden={idx !== current}
            aria-roledescription="slide"
            aria-label={`${idx + 1} / ${total}: ${content.title}`}
          >
            <div className="absolute inset-0">
              <Image
                src={content.thumbnail}
                alt={content.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={idx === 0}
              />
              {/* Multi-layer gradient for cinematic feel */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-transparent to-transparent" />
            </div>

            <div className="absolute inset-0 flex items-end sm:items-center">
              <div className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-8 sm:pb-0 lg:px-10">
                <div className="max-w-lg">
                  {content.isNew && (
                    <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-accent-500/90 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-accent-500/30 backdrop-blur-sm">
                      ✦ NEW
                    </span>
                  )}
                  <h2 className="mb-3 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl line-clamp-2 text-balance font-display drop-shadow-lg">
                    {content.title}
                  </h2>
                  <p className="mb-5 line-clamp-2 text-sm text-white/70 sm:text-base leading-relaxed">
                    {content.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={content.author.avatar}
                        alt={content.author.name}
                        width={32}
                        height={32}
                        className="rounded-full ring-2 ring-white/20"
                      />
                      <span className="text-sm font-medium text-white/90">
                        {content.author.name}
                      </span>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-white/70 backdrop-blur-sm">
                      {content.category[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {total > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {contents.map((_, idx) => (
            <button
              key={contents[idx].id}
              type="button"
              onClick={() => goTo(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500 ease-out",
                idx === current
                  ? "w-8 bg-white shadow-lg shadow-white/30"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              )}
              aria-label={`슬라이드 ${idx + 1}로 이동`}
              aria-current={idx === current}
            />
          ))}
        </div>
      )}
    </section>
  );
}