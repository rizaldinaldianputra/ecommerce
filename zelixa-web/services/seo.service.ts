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
      // If the config is not found or there is a network error (e.g. during build-time SSG)
      // return null instead of throwing to prevent crashing the entire build.
      const isNotFound = error.message?.includes('not found') || error.message?.includes('404');
      const isNetworkError = error.isNetworkError || error.code === 'ECONNREFUSED' || error.message?.includes('fetch failed');
      
      if (isNotFound || isNetworkError) {
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
