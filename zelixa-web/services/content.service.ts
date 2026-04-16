import { apiClient } from './api.client';
import { BaseService } from './base.service';
import { PaginatedResponse } from '@/types/api';
import { ContentItem, ContentSection } from '@/types/content';

class ContentServiceClass extends BaseService<ContentSection> {
  constructor() {
    super('/v1/content-sections');
  }

  async getAll(page = 0, size = 100, platform?: string): Promise<PaginatedResponse<ContentSection>> {
    const url = platform 
      ? `${this.endpoint}?platform=${platform}&page=${page}&size=${size}`
      : `${this.endpoint}?page=${page}&size=${size}`;
    const response = await apiClient.get<any>(url);
    return response.data?.content ? response.data : response;
  }

  async getByTypeAndPlatform(type: string, platform: 'WEB' | 'MOBILE', page = 0, size = 100): Promise<ContentSection[]> {
    const url = `${this.endpoint}?type=${type}&platform=${platform}&page=${page}&size=${size}`;
    const response = await apiClient.get<any>(url);
    const raw = response?.data ?? response;
    const list = raw?.content ?? raw ?? [];
    return Array.isArray(list) ? list.filter((s: ContentSection) => s.type === type && s.platform === platform) : [];
  }

  async getActive(): Promise<ContentSection[]> {
    const response = await apiClient.get<any>(`${this.endpoint}/active`);
    return response?.data ?? response ?? [];
  }

  async getSectionsByType(type: string): Promise<ContentSection[]> {
    const response = await apiClient.get<any>(`${this.endpoint}/type/${type}`);
    return response?.data ?? response ?? [];
  }

  async getActiveSectionsByType(type: string): Promise<ContentSection[]> {
    const response = await apiClient.get<any>(`${this.endpoint}/type/${type}/active`);
    return response?.data ?? response ?? [];
  }

  async getStorefrontSections(): Promise<ContentSection[]> {
    try {
      const response = await this.getAll(0, 100, 'WEB');
      const sections = response.content || (Array.isArray(response) ? response : []);
      return sections
        .filter((s: ContentSection) => s.isActive && (s.platform === 'WEB' || s.platform === 'ALL'))
        .sort((aConf: ContentSection, bConf: ContentSection) => (aConf.displayOrder || 0) - (bConf.displayOrder || 0));
    } catch (error) {
      console.warn('ContentService: Failed to fetch storefront sections. Falling back to default components.', error);
      return [];
    }
  }
}

export const ContentService = new ContentServiceClass();
