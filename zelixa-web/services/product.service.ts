import { Product } from '@/types/product';
import { BaseService } from './base.service';
import { PaginatedResponse } from '@/types/api';
import { apiClient } from './api.client';

class ProductServiceClass extends BaseService<Product> {
  constructor() {
    super('/v1/products');
  }

  async createVariant(productId: number, variant: any) {
    return apiClient.post(`${this.endpoint}/${productId}/variants`, variant);
  }

  async updateVariant(productId: number, variantId: number, variant: any) {
    return apiClient.put(`${this.endpoint}/${productId}/variants/${variantId}`, variant);
  }

  async deleteVariant(productId: number, variantId: number) {
    return apiClient.delete(`${this.endpoint}/${productId}/variants/${variantId}`);
  }

  async addImage(productId: number, imageData: any) {
    return apiClient.post(`${this.endpoint}/${productId}/images`, imageData);
  }

  async deleteImage(productId: number, imageId: number) {
    return apiClient.delete(`${this.endpoint}/${productId}/images/${imageId}`);
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>(`${this.endpoint}/featured`, { params: { size: limit } });
      return response.content || [];
    } catch (error) {
      console.warn('Failed to fetch featured products:', error);
      return [];
    }
  }

  async getTopProducts(limit = 8): Promise<Product[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>(`${this.endpoint}/top`, { params: { size: limit } });
      return response.content || [];
    } catch (error) {
      console.warn('Failed to fetch top products:', error);
      return [];
    }
  }

  async getBestSellers(limit = 8): Promise<Product[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>(`${this.endpoint}/best-sellers`, { params: { size: limit } });
      return response.content || [];
    } catch (error) {
      console.warn('Failed to fetch best sellers:', error);
      return [];
    }
  }

  async getRecommendedProducts(limit = 8): Promise<Product[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>(`${this.endpoint}/recommended`, { params: { size: limit } });
      return response.content || [];
    } catch (error) {
      console.warn('Failed to fetch recommended products:', error);
      return [];
    }
  }

  async getBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get<Product>(`${this.endpoint}/slug/${slug}`);
    return response;
  }

  async getByIds(ids: number[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    const response = await apiClient.get<any>(`${this.endpoint}/list`, { params: { ids: ids.join(',') } });
    return response;
  }

  async getAll(page = 0, size = 10, search?: string, categoryId?: number | string): Promise<PaginatedResponse<Product>> {
    const params: any = { page, size };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    
    const response = await apiClient.get<any>(this.endpoint, { params });
    return response.data?.content ? response.data : response;
  }

  /*
  async searchProductsElastic(q: string, size = 12, page = 0): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>(`${this.endpoint}/search`, { params: { q, size, page } });
  }
  */
}

export const ProductService = new ProductServiceClass();

