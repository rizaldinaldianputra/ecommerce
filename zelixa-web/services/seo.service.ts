import { apiClient } from './api.client';
import { BaseService } from './base.service';
import { SeoConfig } from '@/types/seo';

class SeoServiceClass extends BaseService<SeoConfig> {
  constructor() {
    super('/v1/seo-configs');
  }

  async getByPageName(pageName: string): Promise<SeoConfig | null> {
    try {
      const response = await apiClient.get<any>(`${this.endpoint}/${pageName}`);
      return response.data ?? response;
    } catch (error: any) {
      // If the config is not found, return null instead of throwing an error
      // This is expected for pages that don't have specific SEO scripts yet.
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async save(data: SeoConfig): Promise<SeoConfig> {
    const response = await apiClient.post<any>(this.endpoint, data);
    return response.data ?? response;
  }
}

export const SeoService = new SeoServiceClass();
