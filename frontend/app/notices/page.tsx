"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks";
import { noticesApi } from "@/lib/api/notices";
import type { Notice } from "@/lib/api/types";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FormattedDate } from "@/components/common/FormattedDate";
import { useToast } from "@/lib/hooks/useToast";

export default function NoticesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin';

  const fetchNoticesList = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await noticesApi.list({ limit: 50, offset: 0 });
      setNotices(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "공지사항을 불러오지 못했습니다");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNoticesList();
  }, [fetchNoticesList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      setIsSubmitting(true);
      await noticesApi.create({ title, content, isImportant });
      showToast("공지사항이 성공적으로 게시되었습니다", "success");
      setTitle("");
      setContent("");
      setIsImportant(false);
      setIsCreating(false);
      fetchNoticesList();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "공지사항 작성에 실패했습니다", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-0.5 text-primary-600 hover:text-primary-700 transition-colors"
          >
            ← 홈으로
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            공지사항
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            서비스의 새로운 소식과 안내사항을 확인하세요.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-all active:scale-95"
          >
            {isCreating ? "취소" : "새 공지 작성"}
          </button>
        )}
      </div>

      {isCreating && isAdmin && (
        <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[var(--color-text-primary)]">
                제목
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] px-4 py-2 text-[var(--color-text-primary)] focus:border-primary-500 focus:ring-primary-500 transition-colors"
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-[var(--color-text-primary)]">
                내용
              </label>
              <textarea
                id="content"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] px-4 py-2 text-[var(--color-text-primary)] focus:border-primary-500 focus:ring-primary-500 transition-colors"
                placeholder="공지사항 내용을 입력하세요 (Markdown 지원 예정)"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="important"
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--color-border)] text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="important" className="text-sm font-medium text-[var(--color-text-primary)]">
                중요 공지로 설정 (상단 고정)
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-primary-600 px-8 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-all active:scale-95"
              >
                {isSubmitting ? "저장 중..." : "공지 게시"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-12 space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage title="오류 발생" message={error} onRetry={fetchNoticesList} />
        ) : notices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] py-20 text-center">
            <p className="text-[var(--color-text-secondary)]">등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className={`group relative overflow-hidden rounded-2xl border transition-all hover:shadow-lg ${
                notice.isImportant
                  ? "border-primary-200 bg-primary-50/30 dark:border-primary-900/30 dark:bg-primary-900/10"
                  : "border-[var(--color-border)] bg-[var(--color-bg-surface)]"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {notice.isImportant && (
                        <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-bold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                          중요
                        </span>
                      )}
                      <h2 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-primary-600 transition-colors">
                        {notice.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                      <span>{notice.authorName}</span>
                      <span>•</span>
                      <span><FormattedDate date={notice.createdAt} /></span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                  {notice.content}
                </div>
              </div>
              <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-transparent via-primary-500/10 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
