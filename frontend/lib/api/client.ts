const isServer = typeof window === 'undefined';
const API_BASE_URL = isServer
  ? (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080')
  : (process.env.NEXT_PUBLIC_API_URL || '');

interface FetchOptions extends RequestInit {
  token?: string | null;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function extractErrorMessage(status: number, statusText: string, data: unknown): string {
  if (data && typeof data === 'object' && 'detail' in data) {
    const detail = (data as Record<string, unknown>).detail;
    if (typeof detail === 'string') {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail.map((d: unknown) => {
        if (typeof d === 'object' && d !== null && 'msg' in (d as Record<string, unknown>)) {
          return (d as Record<string, unknown>).msg;
        }
        return String(d);
      }).join('; ');
    }
  }
  return `API Error: ${status} ${statusText}`;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token = null, ...fetchOptions } = options;
  
  // Auto-prepend /api/v1 if not present and not absolute URL
  let fullUrl = endpoint;
  if (!endpoint.startsWith('http') && !endpoint.startsWith('/api/v1')) {
    fullUrl = `/api/v1${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const requestHeaders = options.headers as Record<string, string> | undefined;
  if (requestHeaders) {
    Object.assign(headers, requestHeaders);
  }

  // Auto-include token from localStorage if in browser and not provided
  let actualToken = token;
  if (!actualToken && !isServer) {
    actualToken = localStorage.getItem('auth_token');
  }

  if (actualToken) {
    headers['Authorization'] = `Bearer ${actualToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${fullUrl}`, {
    cache: 'no-store',
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && !isServer) {
      window.dispatchEvent(new CustomEvent('auth-unauthorized'));
    }

    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    throw new ApiError(
      extractErrorMessage(response.status, response.statusText, errorData),
      response.status,
      errorData
    );
  }

  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export const apiClient = {
  get: <T>(url: string, options?: FetchOptions) => 
    fetchApi<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, data?: unknown, options?: FetchOptions) => 
    fetchApi<T>(url, { ...options, method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: <T>(url: string, data?: unknown, options?: FetchOptions) => 
    fetchApi<T>(url, { ...options, method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(url: string, options?: FetchOptions) => 
    fetchApi<T>(url, { ...options, method: 'DELETE' }),
};

export { fetchApi, ApiError, API_BASE_URL };
export type { FetchOptions };