import { ApiRequestOptions } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

/**
 * A standard, generic fetch wrapper for centralizing API communications.
 * Handles the base URL application, standard headers, and default error checks.
 */
class ApiClient {

  private async fetchApi<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    // Ensure endpoint starts with / and base URL doesn't end with / to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    let url = `${cleanBaseUrl}${cleanEndpoint}`;

    // Append query parameters if any
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...options.headers as any,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('shekza_token');
      if (token && token !== 'undefined' && token !== 'null') {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (cleanEndpoint.startsWith('/v1/admin') || cleanEndpoint.startsWith('/workflow')) {
        // Warning: calls to protected endpoints without a token will now return 401 via backend fix
        console.warn(`Attempting to fetch protected endpoint ${cleanEndpoint} without a token.`);
      }
    }

    const controller = new AbortController();
    // Use a very short timeout during build to prevent hanging the entire process
    const isBuild = process.env.NODE_ENV === 'production' && typeof window === 'undefined';
    const timeoutDuration = isBuild ? 3000 : 10000; 
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    try {
      const response = await fetch(url, { 
        ...options, 
        headers,
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      const isTimeout = error.name === 'AbortError';
      const isNetworkError = 
        isTimeout ||
        (error instanceof TypeError && (
          error.message === 'Failed to fetch' || 
          error.message === 'fetch failed' ||
          error.message.includes('network error')
        )) ||
        (error?.code === 'ECONNREFUSED') ||
        (error?.code === 'ENOTFOUND') ||
        (error?.code === 'ETIMEDOUT');

      if (isNetworkError) {
        // Tag the error so services can identify it as a network failure
        error.isNetworkError = true;
        console.error(`[ApiClient] Network error: Unable to connect to ${url}. Is the backend server running?`, {
          message: error.message,
          code: error.code
        });
      }
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const text = await response.text();
    
    // Safety check for empty body
    if (!text || response.status === 204) {
      if (!response.ok) {
        throw new Error(`API Request failed with status ${response.status}: ${response.statusText}`);
      }
      return {} as T;
    }

    let data: any;
    if (isJson && text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
    } else {
      data = text;
    }

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== 'undefined' && !response.url.includes('/auth/login')) {
          localStorage.removeItem('shekza_token');
          localStorage.removeItem('shekza_user');
          window.dispatchEvent(new Event('auth-change'));
        }
      }
      
      const errorMessage = (data && typeof data === 'object') ? (data.message || data.error) : data;
      const finalMessage = errorMessage || `API Request failed with status ${response.status}: ${response.statusText}`;
      throw new Error(finalMessage);
    }

    return data as T;
  }

  public get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.fetchApi<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
    return this.fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  public put<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
    return this.fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  public patch<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
    return this.fetchApi<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  public delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.fetchApi<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
