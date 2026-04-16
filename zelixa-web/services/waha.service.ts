import { apiClient } from './api.client';

export interface WahaStatus {
  status: string;
}

export const wahaService = {
  getStatus: async (): Promise<WahaStatus> => {
    // The backend returns ApiResponse<Map<String, String>>
    // Which looks like { data: { status: "..." }, success: true, ... }
    const response = await apiClient.get<any>('/v1/admin/waha/status');
    return response.data;
  },

  getQrCodeUrl: (): string => {
    // Since the QR code endpoint requires authentication (ROLE_ADMIN), 
    // we can't easily use it in an <img> tag directly without a token in the header.
    // However, if we proxy it or fetch it as a blob, it works.
    // For simplicity, we'll fetch it in the component.
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';
    return `${baseUrl}/v1/admin/waha/qr`;
  },

  fetchQrCodeBlob: async (): Promise<string> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';
    const token = typeof window !== 'undefined' ? localStorage.getItem('shekza_token') : null;
    
    const response = await fetch(`${baseUrl}/v1/admin/waha/qr`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch QR code');
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  startSession: async (): Promise<void> => {
    await apiClient.post('/v1/admin/waha/start', {});
  },

  logoutSession: async (): Promise<void> => {
    await apiClient.post('/v1/admin/waha/logout', {});
  },
};
