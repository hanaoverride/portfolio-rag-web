import type { Category } from './types';

export async function getCategories(): Promise<Category[]> {
  const { fetchApi } = await import('./client');
  return fetchApi('/api/v1/categories');
}

export async function getCategory(slug: string): Promise<Category> {
  const { fetchApi } = await import('./client');
  return fetchApi(`/api/v1/categories/${slug}`);
}