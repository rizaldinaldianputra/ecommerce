import { apiClient } from './api.client';
import { ContentItem } from '@/types/content';

class ContentServiceClass {
  // --- FLAT CONTENT ITEM METHODS ---
  async getItemsByType(type: string, platform: string = 'WEB', activeOnly: boolean = true): Promise<ContentItem[]> {
    const url = `/v1/content/items/type/${type}?platform=${platform}&activeOnly=${activeOnly}`;
    const response = await apiClient.get<ContentItem[]>(url);
    return response ?? [];
  }

  async getById(id: string): Promise<ContentItem> {
    const response = await apiClient.get<ContentItem>(`/v1/content/items/${id}`);
    return response;
  }

  async createItem(item: ContentItem): Promise<ContentItem> {
    const response = await apiClient.post<ContentItem>('/v1/content/items', item);
    return response;
  }

  async updateItem(id: number, item: ContentItem): Promise<ContentItem> {
    const response = await apiClient.put<ContentItem>(`/v1/content/items/${id}`, item);
    return response;
  }

  async deleteItem(id: number): Promise<void> {
    await apiClient.delete(`/v1/content/items/${id}`);
  }
}

export const ContentService = new ContentServiceClass();
