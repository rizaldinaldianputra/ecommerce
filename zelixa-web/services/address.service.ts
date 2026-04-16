import { Address } from '@/types/address';
import { BaseService } from './base.service';
import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api';

class AddressServiceClass extends BaseService<Address> {
  constructor() {
    super('/v1/addresses');
  }

  async getAll(): Promise<Address[]> {
    const response = await apiClient.get<ApiResponse<Address[]>>(this.endpoint);
    return response.data || [];
  }

  async setDefault(id: number | string): Promise<Address> {
    const response = await apiClient.patch<ApiResponse<Address>>(`${this.endpoint}/${id}/set-default`);
    return response.data;
  }
}

export const AddressService = new AddressServiceClass();
