import type { YouTuber, ListYouTubersParams } from './types';

export async function getYoutubers(
  params?: ListYouTubersParams
): Promise<{ items: YouTuber[]; total: number; limit: number; offset: number }> {
  const { fetchApi } = await import('./client');
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const query = searchParams.toString();
  return fetchApi(`/api/v1/youtubers${query ? `?${query}` : ''}`);
}

export async function getYouTuber(id: string): Promise<YouTuber> {
  const { fetchApi } = await import('./client');
  return fetchApi(`/api/v1/youtubers/${id}`);
}