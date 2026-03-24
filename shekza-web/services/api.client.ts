const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

/**
 * A standard, generic fetch wrapper for centralizing API communications.
 * Handles the base URL application, standard headers, and default error checks.
 */
class ApiClient {

  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Ensure endpoint starts with / and base URL doesn't end with / to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const url = `${cleanBaseUrl}${cleanEndpoint}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...options.headers as any,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('shekza_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, { ...options, headers });

    // Try to parse JSON body for both success and error cases
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      // If it's an error response, try to extract the message from our ApiResponse format
      const errorMessage = (data as any)?.message || `API Request failed with status ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data as T;
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.fetchApi<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    return this.fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  public put<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    return this.fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.fetchApi<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
