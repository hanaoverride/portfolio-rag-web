import type {
  Content,
  ListContentsParams,
  GetCategoryContentsParams,
} from './types';

export async function getContents(
  params?: ListContentsParams
): Promise<{ items: Content[]; total: number; limit: number; offset: number }> {
  const { fetchApi } = await import('./client');
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.isNew !== undefined) searchParams.set('is_new', String(params.isNew));
  if (params?.sortBy) searchParams.set('sort_by', params.sortBy);
  if (params?.order) searchParams.set('order', params.order);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const query = searchParams.toString();
  return fetchApi(`/api/v1/contents${query ? `?${query}` : ''}`);
}

export async function getContent(id: string): Promise<Content> {
  const { fetchApi } = await import('./client');
  return fetchApi(`/api/v1/contents/${id}`);
}

export async function incrementViews(id: string): Promise<{ status: string }> {
  const { fetchApi } = await import('./client');
  return fetchApi(`/api/v1/contents/${id}/view`, {
    method: 'POST',
  });
}

export async function getContentsByCategory(
  categorySlug: string,
  params?: GetCategoryContentsParams
): Promise<{ items: Content[]; total: number; limit: number; offset: number }> {
  const { fetchApi } = await import('./client');
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const query = searchParams.toString();
  return fetchApi(`/api/v1/categories/${categorySlug}/contents${query ? `?${query}` : ''}`);
}