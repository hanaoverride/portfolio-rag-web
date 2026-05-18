"use client";

import { useState, useCallback, createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
import type { BookmarkedContent, ListBookmarksParams } from '../api/types';
import { getBookmarks, addBookmark as addBookmarkApi, removeBookmark as removeBookmarkApi } from '../api/bookmarks';
import { getAuthToken, useAuth } from './useAuth';

interface BookmarkContextValue {
  bookmarks: BookmarkedContent[];
  bookmarkedIds: Set<string>;
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchBookmarks: (params?: ListBookmarksParams) => Promise<void>;
  addBookmark: (contentId: string) => Promise<boolean>;
  removeBookmark: (contentId: string) => Promise<boolean>;
  clearError: () => void;
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkedContent[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const clearError = useCallback(() => setError(null), []);

  const fetchBookmarks = useCallback(async (params?: ListBookmarksParams) => {
    const token = getAuthToken();
    if (!token) {
      setBookmarks([]);
      setTotal(0);
      setBookmarkedIds(new Set());
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await getBookmarks(params);
      setBookmarks(result.items);
      setTotal(result.total);
      
      // If we're fetching the first page without specific params, 
      // update bookmarkedIds too for basic sync
      if (!params || (params.offset === 0 && !params.limit)) {
        setBookmarkedIds(new Set(result.items.map(b => b.content.id)));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookmarks';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllBookmarkedIds = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setBookmarkedIds(new Set());
      return;
    }
    try {
      // Fetch a large number to ensure we get most/all IDs for UI icons
      // The backend default is 20, but we can request more.
      const result = await getBookmarks({ limit: 1000 });
      setBookmarkedIds(new Set(result.items.map(b => b.content.id)));
    } catch (err) {
      console.error('Failed to fetch all bookmark IDs:', err);
    }
  }, []);

  // Auto-fetch bookmarks on login
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
      fetchAllBookmarkedIds();
    } else {
      setBookmarks([]);
      setTotal(0);
      setBookmarkedIds(new Set());
    }
  }, [isAuthenticated, fetchBookmarks, fetchAllBookmarkedIds]);

  const addBookmark = useCallback(async (contentId: string): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) {
      setError('Not authenticated');
      return false;
    }

    setError(null);
    // Optimistic update
    setBookmarkedIds(prev => new Set(prev).add(contentId));
    setTotal(prev => prev + 1);
    
    try {
      await addBookmarkApi(contentId);
      return true;
    } catch (err) {
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        next.delete(contentId);
        return next;
      });
      setTotal(prev => Math.max(0, prev - 1));
      const message = err instanceof Error ? err.message : 'Failed to add bookmark';
      setError(message);
      return false;
    }
  }, []);

  const removeBookmark = useCallback(async (contentId: string): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) return false;

    setError(null);
    // Optimistic update
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      next.delete(contentId);
      return next;
    });
    setBookmarks(prev => prev.filter(b => b.content.id !== contentId));
    setTotal(prev => Math.max(0, prev - 1));

    try {
      await removeBookmarkApi(contentId);
      return true;
    } catch (err) {
      // Revert optimistic update
      await fetchAllBookmarkedIds();
      await fetchBookmarks(); 
      const message = err instanceof Error ? err.message : 'Failed to remove bookmark';
      setError(message);
      return false;
    }
  }, [fetchAllBookmarkedIds, fetchBookmarks]);

  const value = useMemo(() => ({
    bookmarks,
    bookmarkedIds,
    total,
    isLoading,
    error,
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    clearError,
  }), [bookmarks, bookmarkedIds, total, isLoading, error, fetchBookmarks, addBookmark, removeBookmark, clearError]);

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks(): BookmarkContextValue {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}
