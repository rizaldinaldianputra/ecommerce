import { apiClient } from './api.client';
import { WorkflowTask } from '@/types/order-workflow';

class OrderWorkflowServiceClass {
  private endpoint = '/workflow/orders';

  async getAdminTasks(): Promise<WorkflowTask[]> {
    return apiClient.get(`${this.endpoint}/tasks/admin`);
  }

  async getUserTasks(): Promise<WorkflowTask[]> {
    return apiClient.get(`${this.endpoint}/tasks/user`);
  }

  async completeTask(taskId: string, variables: Record<string, any>): Promise<void> {
    return apiClient.post(`${this.endpoint}/tasks/${taskId}/complete`, variables);
  }
}

export const OrderWorkflowService = new OrderWorkflowServiceClass();
