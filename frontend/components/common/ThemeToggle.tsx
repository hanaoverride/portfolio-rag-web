"use client";

import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function getSystemPreference(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: Theme) {
  const isDark =
    theme === "dark" || (theme === "system" && getSystemPreference());
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = stored ?? "system";
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const cycleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : prev === "dark" ? "system" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  // Prevent hydration mismatch — render a placeholder with the same dimensions
  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-page)]",
          className
        )}
        aria-label="테마 전환"
      >
        <Monitor className="h-[18px] w-[18px]" />
      </button>
    );
  }

  const icon =
    theme === "light" ? (
      <Sun className="h-[18px] w-[18px]" />
    ) : theme === "dark" ? (
      <Moon className="h-[18px] w-[18px]" />
    ) : (
      <Monitor className="h-[18px] w-[18px]" />
    );

  const label =
    theme === "light"
      ? "라이트 모드"
      : theme === "dark"
        ? "다크 모드"
        : "시스템 모드";

  return (
    <button
      type="button"
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-page)] hover:text-[var(--color-text-primary)] active:scale-90",
        className
      )}
      onClick={cycleTheme}
      aria-label={`현재: ${label}. 클릭하여 테마 전환`}
      title={label}
    >
      {icon}
    </button>
  );
}