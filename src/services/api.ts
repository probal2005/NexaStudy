import { getCurrentOrigin } from '@/lib/browser';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

export function buildApiUrl(path: string): string {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  if (!API_BASE_URL) {
    return `${getCurrentOrigin()}${path}`;
  }

  return `${API_BASE_URL}${path}`;
}

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const body = await parseResponse<
        ApiErrorResponse | string
      >(response);

      if (typeof body === 'string' && body.trim()) {
        message = body;
      } else if (
        typeof body === 'object' &&
        body !== null &&
        'message' in body &&
        body.message
      ) {
        message = body.message;
      }
    } catch {
      // Keep default error message.
    }

    throw new Error(message);
  }

  return parseResponse<T>(response);
}

export async function apiGet<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  return apiRequest<T>(path, {
    method: 'GET',
    headers: options.headers,
    signal: options.signal,
  });
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    headers: options.headers,
    signal: options.signal,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function apiPut<T>(
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  return apiRequest<T>(path, {
    method: 'PUT',
    headers: options.headers,
    signal: options.signal,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  return apiRequest<T>(path, {
    method: 'PATCH',
    headers: options.headers,
    signal: options.signal,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function apiDelete<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  return apiRequest<T>(path, {
    method: 'DELETE',
    headers: options.headers,
    signal: options.signal,
  });
}