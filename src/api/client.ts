import type { LoginResponse } from '../types/auth.types';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AUTH_STORAGE_KEY = 'user';

let refreshPromise: Promise<string | null> | null = null;

function readAuthState(): LoginResponse | null {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
  return storedUser ? (JSON.parse(storedUser) as LoginResponse) : null;
}

function writeAuthState(auth: LoginResponse | null): void {
  if (!auth) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event('auth:logout'));
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  window.dispatchEvent(new Event('auth:updated'));
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const auth = readAuthState();

  if (!auth?.refreshToken) {
    writeAuthState(null);
    return null;
  }

  refreshPromise = (async () => {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: auth.refreshToken }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.accessToken) {
      writeAuthState(null);
      throw new Error(
        result?.message || 'Your session has expired. Please sign in again.',
      );
    }

    const refreshedAuth = { ...auth, ...result } as LoginResponse;
    writeAuthState(refreshedAuth);
    return refreshedAuth.accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

function buildHeaders(init?: RequestInit): Headers {
  const headers = new Headers(init?.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (
    !headers.has('Content-Type') &&
    init?.body &&
    typeof init.body === 'string'
  ) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

export async function apiRequest<T>(
  endpoint: string,
  init: RequestInit = {},
  options: { skipAuth?: boolean; retry?: boolean } = {},
): Promise<T> {
  const headers = buildHeaders(init);

  if (!options.skipAuth) {
    const auth = readAuthState();
    if (auth?.accessToken) {
      headers.set('Authorization', `Bearer ${auth.accessToken}`);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...init,
    headers,
  });

  if (response.status === 401 && !options.skipAuth && !options.retry) {
    try {
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        headers.set('Authorization', `Bearer ${refreshedToken}`);
        return apiRequest<T>(
          endpoint,
          { ...init, headers },
          { ...options, retry: true },
        );
      }
    } catch {
      throw new Error('Your session has expired. Please sign in again.');
    }
  }

  const contentType = response.headers.get('content-type') ?? '';
  const result = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    throw result ?? { message: 'Request failed' };
  }

  return result as T;
}
