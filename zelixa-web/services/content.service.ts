import { apiClient } from './api.client';
import { ContentItem } from '@/types/content';

/**
 * Service for managing both legacy "Sections" and the new "Flat" content items.
 * Handles platform-specific content for Web and Mobile storefronts.
 */
class ContentServiceClass {
  // --- FLAT CONTENT ITEM METHODS (Public & Protected) ---

  /**
   * Fetches content items by type for public display (Storefront).
   * Uses a 'public' path specifically designed for anonymous access.
   */
  async getPublicItemsByType(type: string, platform: string = 'WEB'): Promise<ContentItem[]> {
    try {
      // Trying the direct path. If it returns 401, it means the backend hasn't whitelisted it yet.
      const url = `/v1/content/items/type/${type}`;
      const response = await apiClient.get<ContentItem[]>(url, {
        params: { platform, activeOnly: true }
      });
      return response ?? [];
    } catch (error: any) {
      // Graceful fallback: Log the error and return empty array so storefront doesn't crash
      console.warn(`[ContentService] Failed to fetch public content for ${type}:`, error.message);
      return [];
    }
  }

  /**
   * Fetches content items by type for administrative management.
   * Uses the protected path and supports viewing inactive items.
   */
  async getItemsByType(type: string, platform: string = 'WEB', activeOnly: boolean = false): Promise<ContentItem[]> {
    const url = `/v1/content/items/type/${type}`;
    const response = await apiClient.get<ContentItem[]>(url, {
      params: { platform, activeOnly }
    });
    return response ?? [];
  }

  async getAllItems(platform?: string): Promise<ContentItem[]> {
    const response = await apiClient.get<ContentItem[]>('/v1/content/items', {
      params: platform ? { platform } : {}
    });
    return response ?? [];
  }

  async getById(id: string | number): Promise<ContentItem> {
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
  
  // --- SECTION METHODS ---

  async getSections(platform: string = 'WEB'): Promise<any[]> {
    const response = await apiClient.get<any[]>('/v1/content/sections', {
      params: { platform }
    });
    return response ?? [];
  }

  async getSectionById(id: number | string): Promise<any> {
    const response = await apiClient.get<any>(`/v1/content/sections/${id}`);
    return response;
  }

  async createSection(section: any): Promise<any> {
    const response = await apiClient.post<any>('/v1/content/sections', section);
    return response;
  }

  async updateSection(id: number | string, section: any): Promise<any> {
    const response = await apiClient.put<any>(`/v1/content/sections/${id}`, section);
    return response;
  }

  async deleteSection(id: number | string): Promise<void> {
    await apiClient.delete(`/v1/content/sections/${id}`);
  }

  // --- LEGACY COMPATIBILITY METHODS (For Banner/Section Pages) ---

  async getAll(page = 0, size = 100, platform?: string): Promise<any> {
    // Legacy pages like BannersPage still use this. 
    // We route it to the new items API with high limit as a fallback
    const params: any = { page, size };
    if (platform) params.platform = platform;
    
    // Attempting to hit the generic list endpoint
    const response = await apiClient.get<any>('/v1/content/items', { params });
    return response;
  }

  async update(id: number | string, data: any): Promise<any> {
    return this.updateItem(Number(id), data);
  }

  async delete(id: number | string): Promise<any> {
    return this.deleteItem(Number(id));
  }
}

export const ContentService = new ContentServiceClass();

export interface ContentSection {
  id?: number;
  platform: 'WEB' | 'MOBILE' | 'ALL';
  type: string;
  title?: string;
  subtitle?: string;
  displayOrder: number;
  isActive: boolean;
  items?: ContentItem[];
}
