import { apiClient } from './api.client';
import { BaseService } from './base.service';
import { PaginatedResponse } from '@/types/api';
import { FlashSale, FlashSaleItem } from '@/types/flash-sale';

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
