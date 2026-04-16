import { apiClient } from './api.client';
import { NotificationHistory, PushNotificationRequest } from '@/types/notification';

class NotificationServiceClass {
  private endpoint = '/v1/notifications';

  async getAll(): Promise<any> {
    return apiClient.get(`${this.endpoint}`);
  }

  async getUnreadCount(): Promise<any> {
    return apiClient.get(`${this.endpoint}/unread-count`);
  }

  async markAsRead(id: number): Promise<any> {
    return apiClient.put(`${this.endpoint}/${id}/read`, {});
  }

  async markAllAsRead(): Promise<any> {
    return apiClient.put(`${this.endpoint}/read-all`, {});
  }

  async clearAll(): Promise<any> {
    return apiClient.delete(`${this.endpoint}/clear`);
  }

  async push(request: PushNotificationRequest): Promise<any> {
    return apiClient.post(`${this.endpoint}/push`, request);
  }
}

export const NotificationService = new NotificationServiceClass();
