import { apiClient } from './client';
import type {
  Notice,
  ListNoticesParams,
  PaginatedNoticesResponse,
  CreateNoticeRequest,
} from './types';

export const noticesApi = {
  /**
   * List notices with pagination.
   */
  async list(params?: ListNoticesParams): Promise<PaginatedNoticesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));

    const query = searchParams.toString();
    return apiClient.get<PaginatedNoticesResponse>(`/notices${query ? `?${query}` : ''}`);
  },

  /**
   * Get a specific notice by ID.
   */
  async get(id: number): Promise<Notice> {
    return apiClient.get<Notice>(`/notices/${id}`);
  },

  /**
   * Create a new notice (Admin only).
   */
  async create(data: CreateNoticeRequest): Promise<Notice> {
    return apiClient.post<Notice>('/notices', data);
  }
};
