import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api';
import { WishlistItemResponse } from '@/types/wishlist';

class WishlistService {
  async getWishlist(): Promise<WishlistItemResponse[]> {
    const response = await apiClient.get<ApiResponse<WishlistItemResponse[]>>('/v1/wishlist');
    return response.data;
  }

  async toggleWishlist(productId: number): Promise<void> {
    await apiClient.post(`/v1/wishlist/${productId}`, null);
  }

  async removeFromWishlist(id: number): Promise<void> {
    await apiClient.delete(`/v1/wishlist/${id}`);
  }
}

export const wishlistService = new WishlistService();
