import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api';
import { CartItemResponse, CartItemRequest } from '@/types/cart';

class CartService {
  async getCart(): Promise<CartItemResponse[]> {
    const response = await apiClient.get<ApiResponse<CartItemResponse[]>>('/v1/cart');
    return response.data;
  }

  async addToCart(request: CartItemRequest): Promise<CartItemResponse> {
    const response = await apiClient.post<ApiResponse<CartItemResponse>>('/v1/cart', request);
    return response.data;
  }

  async updateQuantity(id: number, quantity: number): Promise<CartItemResponse> {
    const response = await apiClient.put<ApiResponse<CartItemResponse>>(`/v1/cart/${id}`, null, {
      params: { quantity }
    });
    return response.data;
  }

  async removeFromCart(id: number): Promise<void> {
    await apiClient.delete(`/v1/cart/${id}`);
  }

  async clearCart(): Promise<void> {
    await apiClient.delete('/v1/cart/clear');
  }
}

export const cartService = new CartService();
