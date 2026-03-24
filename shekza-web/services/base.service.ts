import { apiClient } from './api.client';

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export class BaseService<T> {
  constructor(protected endpoint: string) {}

  async getAll(page = 0, size = 10): Promise<PaginatedResponse<T>> {
    const response = await apiClient.get<any>(`${this.endpoint}?page=${page}&size=${size}`);
    // Support both wrapped (status, message, data) and unwrapped (Spring Page)
    return response.data?.content ? response.data : response;
  }

  async getById(id: number | string): Promise<T> {
    const response = await apiClient.get<any>(`${this.endpoint}/${id}`);
    return response.data ?? response;
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await apiClient.post<any>(this.endpoint, data);
    return response.data ?? response;
  }

  async update(id: number | string, data: Partial<T>): Promise<T> {
    const response = await apiClient.put<any>(`${this.endpoint}/${id}`, data);
    return response.data ?? response;
  }

  async delete(id: number | string): Promise<any> {
    return apiClient.delete<any>(`${this.endpoint}/${id}`);
  }
}
