import { Review } from '@/types/review';
import { BaseService } from './base.service';
import { PaginatedResponse } from '@/types/api';
import { apiClient } from './api.client';

class ReviewServiceClass extends BaseService<Review> {
  constructor() {
    super('/v1/reviews');
  }

  async getByProductId(productId: number, page = 0, size = 10): Promise<PaginatedResponse<Review>> {
    const response = await apiClient.get<PaginatedResponse<Review>>(`${this.endpoint}/product/${productId}`, {
      params: { page, size }
    });
    return response;
  }

  async updateStatus(id: number, isActive: boolean): Promise<Review> {
    const response = await apiClient.put<Review>(`${this.endpoint}/${id}/status`, null, {
      params: { isActive }
    });
    return response;
  }
}

export const ReviewService = new ReviewServiceClass();
