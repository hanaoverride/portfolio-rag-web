"use client";

import { useEffect, useState, useCallback } from "react";
import { ContentGrid } from "@/components/home/ContentGrid";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useContents } from "@/lib/hooks/useContents";
import { useBookmarks, useAuth } from "@/lib/hooks";
import { getCategories } from "@/lib/api/categories";
import type { Category } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export default function ContentsPage() {
  const { contents, isLoading, error, fetchContents, clearError } = useContents();
  const { isAuthenticated } = useAuth();
  const { bookmarkedIds, addBookmark, removeBookmark } = useBookmarks();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    loadCategories();
  }, []);

  const loadContents = useCallback(() => {
    fetchContents({
      category: selectedCategory === "all" ? undefined : selectedCategory,
      search: searchQuery || undefined,
      limit: 50
    });
  }, [fetchContents, selectedCategory, searchQuery]);

  useEffect(() => {
    loadContents();
  }, [loadContents]);

  const handleBookmarkToggle = useCallback(async (contentId: string) => {
    if (!isAuthenticated) return;
    const isCurrentlyBookmarked = bookmarkedIds.has(contentId);
    if (isCurrentlyBookmarked) {
      await removeBookmark(contentId);
    } else {
      await addBookmark(contentId);
    }
  }, [isAuthenticated, addBookmark, removeBookmark, bookmarkedIds]);

  return (
    <main className="min-h-screen bg-[var(--color-bg-page)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-[var(--color-text-primary)] sm:text-4xl font-display section-title-decoration">
              콘텐츠 둘러보기
            </h1>
            <p className="max-w-2xl text-lg text-[var(--color-text-secondary)] leading-relaxed">
              다양한 분야의 유익한 콘텐츠를 한눈에 확인하고 필요한 지식을 습득하세요.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
                  selectedCategory === "all"
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                    : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-primary-300"
                )}
              >
                전체
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
                    selectedCategory === cat.name
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                      : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-primary-300"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder="콘텐츠 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-5 py-2.5 pr-12 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <ErrorMessage
              title="데이터를 불러올 수 없습니다"
              message={error}
              onRetry={loadContents}
            />
          </div>
        ) : contents.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4 glass rounded-3xl p-12">
            <div className="text-5xl">🔍</div>
            <h3 className="text-xl font-bold">검색 결과가 없습니다</h3>
            <p className="text-[var(--color-text-secondary)]">다른 검색어나 카테고리를 선택해 보세요.</p>
            <button 
              onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
              className="mt-4 text-primary-600 font-semibold hover:underline"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <ContentGrid
            contents={contents}
            isAuthenticated={isAuthenticated}
            bookmarkedIds={bookmarkedIds}
            onBookmarkToggle={handleBookmarkToggle}
          />
        )}
      </div>
    </main>
  );
}
