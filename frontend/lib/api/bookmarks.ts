import { getAuthToken } from '@/lib/hooks/useAuth';

import type {
  BookmarkRequest,
  PaginatedBookmarksResponse,
  ListBookmarksParams,
} from './types';

export async function getBookmarks(
  params?: ListBookmarksParams
): Promise<PaginatedBookmarksResponse> {
  const { fetchApi } = await import('./client');
  const token = getAuthToken();
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const query = searchParams.toString();
  return fetchApi(`/api/v1/bookmarks${query ? `?${query}` : ''}`, { token });
}

export async function addBookmark(
  contentId: string
): Promise<{ message: string }> {
  const { fetchApi } = await import('./client');
  const token = getAuthToken();
  return fetchApi('/api/v1/bookmarks', {
    method: 'POST',
    body: JSON.stringify({ contentId } as BookmarkRequest),
    token,
  });
}

export async function removeBookmark(contentId: string): Promise<{ status: string; message: string }> {
  const { fetchApi } = await import('./client');
  const token = getAuthToken();
  return fetchApi(`/api/v1/bookmarks/${contentId}`, {
    method: 'DELETE',
    token,
  });
}

export async function checkBookmark(contentId: string): Promise<boolean> {
  const { fetchApi } = await import('./client');
  const token = getAuthToken();
  try {
    await fetchApi(`/api/v1/bookmarks/${contentId}`, { token });
    return true;
  } catch {
    return false;
  }
}