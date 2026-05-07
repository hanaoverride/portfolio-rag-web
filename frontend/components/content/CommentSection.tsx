"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FormattedDate } from "@/components/common/FormattedDate";
import type { CommentResponse } from "@/lib/api/types";
import { getComments, addComment, deleteComment } from "@/lib/api/comments";
import { getAuthToken, useAuth } from "@/lib/hooks/useAuth";


interface CommentSectionProps {
  contentId: string;
  className?: string;
}

export function CommentSection({ contentId, className }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getComments(contentId);
      setComments(result.items);
      setTotalCount(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "댓글을 불러올 수 없습니다");
    } finally {
      setIsLoading(false);
    }
  }, [contentId]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getAuthToken());
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async () => {
    const token = getAuthToken();
    if (!token) return;
    const text = newComment.trim();
    if (!text) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const comment = await addComment(contentId, text);
      setComments((prev) => [...prev, comment]);
      setTotalCount((prev) => prev + 1);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      setError(err instanceof Error ? err.message : "댓글 작성에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    const token = getAuthToken();
    if (!token) {
      setError("로그인이 필요합니다");
      return;
    }

    setIsDeleting(commentId);
    setError(null);
    try {
      await deleteComment(contentId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setError(err instanceof Error ? err.message : "댓글 삭제에 실패했습니다");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <section className={cn("space-y-6", className)} id="comments">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          댓글 <span className="text-[var(--color-text-muted)]">{totalCount}</span>
        </h2>
      </div>

      {isAuthenticated ? (
        <div className="flex gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
            rows={2}
            className="flex-1 resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !newComment.trim()}
            className="inline-flex h-fit items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" className="text-white" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            등록
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--color-border)] bg-neutral-50 px-4 py-3 text-center text-sm text-[var(--color-text-secondary)] dark:bg-neutral-800">
          댓글을 작성하려면 로그인이 필요합니다
        </div>
      )}

      {error && (
        <ErrorMessage message={error} onRetry={loadComments} />
      )}

      {isLoading ? (
        <div className="py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--color-text-muted)]">
          아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => {
            const isOwn = currentUserId !== null && comment.userId === currentUserId;
            return (
              <li
                key={comment.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {comment.authorName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      <FormattedDate date={comment.createdAt} format="relative" />
                    </span>
                    {isOwn && (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        disabled={isDeleting === comment.id}
                        className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-error transition-colors duration-fast hover:bg-error-light"
                        aria-label="댓글 삭제"
                      >
                        {isDeleting === comment.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {comment.text}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}