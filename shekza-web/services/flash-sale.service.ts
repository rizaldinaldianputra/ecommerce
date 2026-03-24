import { apiClient } from './api.client';
import { PaginatedResponse, BaseService } from './base.service';

export interface FlashSaleItem {
  id?: number;
  productId: number;
  variantId: number;
  productName?: string;
  discountPrice: number;
  stockLimit?: number;
  soldCount?: number;
}

export interface FlashSale {
  id?: number;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  items: FlashSaleItem[];
  createdAt?: string;
}

class FlashSaleServiceClass extends BaseService<FlashSale> {
  constructor() {
    super('/flash-sales');
  }

  async getActive(): Promise<FlashSale[]> {
    const response = await apiClient.get<any>(`${this.endpoint}/active`);
    return response.data ?? response;
  }
}

export const FlashSaleService = new FlashSaleServiceClass();
