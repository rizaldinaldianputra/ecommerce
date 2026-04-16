import { apiClient } from './api.client';
import { PaginatedResponse } from '@/types/api';
import { StockTransaction, StockSummary, StockTransactionRequest } from '@/types/stock';

class StockTransactionServiceClass {
  private endpoint = '/stock-transactions';

  async addStock(request: StockTransactionRequest): Promise<StockTransaction> {
    return apiClient.post(`${this.endpoint}/add`, request);
  }

  async adjustStock(request: StockTransactionRequest): Promise<StockTransaction> {
    return apiClient.post(`${this.endpoint}/adjust`, request);
  }

  async getHistoryByVariant(variantId: number, page = 0, size = 10): Promise<PaginatedResponse<StockTransaction>> {
    return apiClient.get(`${this.endpoint}/variant/${variantId}?page=${page}&size=${size}`);
  }

  async getHistoryByProduct(productId: number, page = 0, size = 10): Promise<PaginatedResponse<StockTransaction>> {
    return apiClient.get(`${this.endpoint}/product/${productId}?page=${page}&size=${size}`);
  }

  async getHistory(query = '', page = 0, size = 10): Promise<PaginatedResponse<StockTransaction>> {
    return apiClient.get(`${this.endpoint}/history?query=${query}&page=${page}&size=${size}`);
  }

  async getSummary(variantId: number): Promise<StockSummary> {
    return apiClient.get(`${this.endpoint}/summary/${variantId}`);
  }

  async getSummaries(variantIds: number[]): Promise<StockSummary[]> {
    const ids = variantIds.join(',');
    return apiClient.get(`${this.endpoint}/summaries?variantIds=${ids}`);
  }
}

export const StockTransactionService = new StockTransactionServiceClass();
