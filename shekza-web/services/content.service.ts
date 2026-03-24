import { apiClient } from './api.client';
import { BaseService } from './base.service';

export interface ContentItem {
  id?: number;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  linkUrl?: string;
  productId?: number;
  tag?: string;
  ctaText?: string;
  badgeText?: string;
  iconName?: string;
  emoji?: string;
  styleConfig?: string;
  displayOrder?: number;
}

export interface ContentSection {
  id?: number;
  title: string;
  type: 'HERO_CAROUSEL' | 'CURATED_PRODUCTS' | 'RECOMMENDED_PRODUCTS' | 'PICKED_FOR_YOU' | 'WHY_SHOP' | 'SHOP_THE_LOOK' | 'GRID' | 'BANNER' | 'NEWS';
  displayOrder: number;
  isActive: boolean;
  items: ContentItem[];
}

class ContentServiceClass extends BaseService<ContentSection> {
  constructor() {
    super('/content-sections');
  }

  async getActive(): Promise<ContentSection[]> {
    const response = await apiClient.get<any>(`${this.endpoint}/active`);
    return response.data ?? response;
  }

  async getSectionsByType(type: string): Promise<ContentSection[]> {
    const response = await apiClient.get<any>(`${this.endpoint}/type/${type}`);
    return response.data ?? response;
  }

  async getActiveSectionsByType(type: string): Promise<ContentSection[]> {
    const response = await apiClient.get<any>(`${this.endpoint}/type/${type}/active`);
    return response.data ?? response;
  }
}

export const ContentService = new ContentServiceClass();
