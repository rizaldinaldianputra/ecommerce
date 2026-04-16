import { apiClient } from './api.client';
import { BaseService } from './base.service';
import { News } from '@/types/news';

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
