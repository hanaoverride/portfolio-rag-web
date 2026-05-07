"use client";

import { useState, useEffect } from "react";

interface FormattedDateProps {
  date: string | Date;
  format?: "full" | "relative" | "short";
  className?: string;
}

export function FormattedDate({ date, format = "full", className }: FormattedDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (!mounted) {
    // Return a placeholder or the raw date string to avoid layout shift
    // but without the locale-specific formatting that causes hydration mismatch
    return <span className={className}>...</span>;
  }

  let formatted = "";
  if (format === "full") {
    formatted = dateObj.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (format === "short") {
    formatted = dateObj.toLocaleDateString("ko-KR");
  } else if (format === "relative") {
    formatted = formatRelativeTime(dateObj);
  }

  return <span className={className}>{formatted}</span>;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffWeek < 5) return `${diffWeek}주 전`;
  if (diffMonth < 12) return `${diffMonth}개월 전`;
  return date.toLocaleDateString("ko-KR");
}
