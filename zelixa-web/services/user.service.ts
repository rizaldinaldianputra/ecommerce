import { apiClient } from './api.client';
import { BaseService } from './base.service';
import { PaginatedResponse } from '@/types/api';
import { User } from '@/types/user';

class UserServiceClass extends BaseService<User> {
  constructor() {
    super('/admin/users');
  }

  async create(data: Partial<User> & { password?: string, roleNames?: string[] }): Promise<User> {
    const response = await apiClient.post<any>(this.endpoint, data);
    return response.data ?? response;
  }

  async updateRolesAndGroups(id: number, data: { taskGroup: string; roleNames: string[] }): Promise<User> {
    const response = await apiClient.put<any>(`${this.endpoint}/${id}/roles-groups`, data);
    return response.data ?? response;
  }

  async getAllRoles(): Promise<{ id: number; name: string }[]> {
    const response = await apiClient.get<any>(`${this.endpoint}/roles`);
    return response.data ?? response;
  }
}

export const UserService = new UserServiceClass();
