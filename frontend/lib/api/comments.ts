import { getAuthToken } from '@/lib/hooks/useAuth';

import type {
  CommentRequest,
  CommentResponse,
  PaginatedCommentsResponse,
  ListCommentsParams,
} from './types';

export async function getComments(
  contentId: string,
  params?: ListCommentsParams
): Promise<PaginatedCommentsResponse> {
  const { fetchApi } = await import('./client');
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const query = searchParams.toString();
  return fetchApi(`/api/v1/contents/${contentId}/comments${query ? `?${query}` : ''}`);
}

export async function addComment(
  contentId: string,
  text: string
): Promise<CommentResponse> {
  const { fetchApi } = await import('./client');
  const token = getAuthToken();
  return fetchApi(`/api/v1/contents/${contentId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text } as CommentRequest),
    token,
  });
}

export async function updateComment(
  contentId: string,
  commentId: number,
  text: string
): Promise<CommentResponse> {
  const { fetchApi } = await import('./client');
  const token = getAuthToken();
  return fetchApi(`/api/v1/contents/${contentId}/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ text } as CommentRequest),
    token,
  });
}

export async function deleteComment(
  contentId: string,
  commentId: number
): Promise<{ status: string; message: string }> {
  const { fetchApi } = await import('./client');
  const token = getAuthToken();
  return fetchApi(`/api/v1/contents/${contentId}/comments/${commentId}`, {
    method: 'DELETE',
    token,
  });
}