import { apiClient } from './api.client';
import { PaginatedResponse } from './base.service';

export interface StockTransaction {
  id: number;
  variantId: number;
  sku: string;
  productName: string;
  productId: number;
  quantity: number;
  type: 'ADDITION' | 'ADJUSTMENT' | 'INITIAL' | 'SALE' | 'RETURN';
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface StockSummary {
  variantId: number;
  sku: string;
  productName: string;
  currentStock: number;
  totalIn: number;
  totalOut: number;
}

export interface StockTransactionRequest {
  variantId: number;
  quantity: number;
  notes: string;
}

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
