"use client";

import { useState, useCallback } from 'react';
import type { Content, ListContentsParams } from '../api/types';
import { getContents, getContent } from '../api/contents';

interface UseContentsReturn {
  contents: Content[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchContents: (filters?: ListContentsParams) => Promise<void>;
  fetchContentById: (id: string) => Promise<Content | null>;
  searchContents: (query: string) => Promise<void>;
  clearError: () => void;
}

export function useContents(): UseContentsReturn {
  const [contents, setContents] = useState<Content[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchContents = useCallback(async (filters?: ListContentsParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getContents(filters);
      setContents(result.items);
      setTotal(result.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch contents';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchContentById = useCallback(async (id: string): Promise<Content | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getContent(id);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch content';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchContents = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getContents({ search: query });
      setContents(result.items);
      setTotal(result.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    contents,
    total,
    isLoading,
    error,
    fetchContents,
    fetchContentById,
    searchContents,
    clearError,
  };
}
