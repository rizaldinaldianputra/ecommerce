import { BaseService } from './base.service';
import { Order } from '@/types/order';
import { apiClient } from './api.client';

class OrderServiceClass extends BaseService<Order> {
  constructor() {
    super('/orders');
  }

  async updateStatus(id: number | string, status: string) {
    return apiClient.put(`${this.endpoint}/${id}/status`, { status });
  }
}

export const OrderService = new OrderServiceClass();
