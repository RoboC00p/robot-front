const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/';

type params = Record<
  string,
  | string
  | number
  | boolean
  | undefined
  | Array<string | number | boolean | undefined>
>;

interface RequestOptions {
  url: string;
  data?: unknown;
  params?: params;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(
  { url, data, params }: RequestOptions,
  method: HttpMethod
): Promise<T> {
  const urlObj = new URL(url, API_BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value
          .filter((v) => v != null)
          .forEach((v) => urlObj.searchParams.append(key, String(v)));
      } else if (value != null) {
        urlObj.searchParams.append(key, String(value));
      }
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (data != null && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(urlObj.toString(), options);

  if (!response.ok) {
    const errorText = await response.text();
    let message: string;
    try {
      const json = JSON.parse(errorText);
      message = json.message || json.error || response.statusText;
    } catch {
      message = errorText || response.statusText;
    }

    // Gestion spéciale pour les erreurs d'authentification
    if (response.status === 401) {
      // Token expiré ou invalide - rediriger vers la page de connexion
      if (globalThis.window !== undefined) {
        globalThis.window.location.href = '/login';
      }
    }

    throw new HttpError(response.status, message);
  }

  // If no content
  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export class APIClient {
  get baseURL(): string {
    return API_BASE_URL;
  }

  get<T>(url: string, params?: params): Promise<T> {
    return request<T>({ url, params }, 'GET');
  }

  post<T>(url: string, data: unknown, params?: params): Promise<T> {
    return request<T>({ url, data, params }, 'POST');
  }

  put<T>(url: string, data: unknown, params?: params): Promise<T> {
    return request<T>({ url, data, params }, 'PUT');
  }

  delete<T>(url: string, params?: params): Promise<T> {
    return request<T>({ url, params }, 'DELETE');
  }

  getDownloadUrl(url: string, params?: params): string {
    const urlObj = new URL(url, API_BASE_URL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value
            .filter((v) => v != null)
            .forEach((v) => urlObj.searchParams.append(key, String(v)));
        } else if (value != null) {
          urlObj.searchParams.append(key, String(value));
        }
      });
    }
    return urlObj.toString();
  }
}

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const apiClient = new APIClient();
