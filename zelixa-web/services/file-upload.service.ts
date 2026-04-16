import { apiClient } from './api.client';

export const FileUploadService = {
  async upload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{ url: string }>('/v1/upload', formData);

    return response.url;
  },
};
