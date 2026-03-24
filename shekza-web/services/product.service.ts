import { Product } from '@/types/product';
import { BaseService, PaginatedResponse } from './base.service';
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

  // Specific method for featured products if your backend has it, 
  // otherwise fallback to first page of products
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await this.getAll(0, 4);
      return response.content;
    } catch (error) {
      console.warn('Failed to fetch featured products:', error);
      return [];
    }
  }
}

export const ProductService = new ProductServiceClass();

