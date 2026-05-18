import { apiClient } from './client';
import { Notification, CreateNotificationRequest } from './types';

export const notificationsApi = {
  /**
   * Get notifications for the current user.
   */
  async list(): Promise<Notification[]> {
    return apiClient.get<Notification[]>('/notifications', { cache: 'no-store' } as RequestInit);
  },

  /**
   * Create a new notification (Admin only).
   */
  async create(data: CreateNotificationRequest): Promise<Notification> {
    return apiClient.post<Notification>('/notifications', data);
  },

  /**
   * Delete a notification.
   */
  async delete(id: number): Promise<void> {
    return apiClient.post(`/notifications/${id}/delete`);
  },

  /**
   * Delete all notifications for the current user.
   */
  async deleteAll(): Promise<void> {
    return apiClient.post('/notifications/delete-all');
  },
};
