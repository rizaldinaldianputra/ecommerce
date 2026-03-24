import { apiClient } from './api.client';
import { BaseService } from './base.service';

export interface News {
  id?: number;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
  isActive: boolean;
  publishedAt?: string;
  createdAt?: string;
}

class NewsServiceClass extends BaseService<News> {
  constructor() {
    super('/news');
  }

  async getBySlug(slug: string): Promise<News> {
    const response = await apiClient.get<any>(`${this.endpoint}/slug/${slug}`);
    return response.data ?? response;
  }
}

export const NewsService = new NewsServiceClass();
