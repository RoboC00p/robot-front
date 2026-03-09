import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError, apiClient } from './client';

const baseUrl = 'http://localhost:3001/api/';
let mockFetch: ReturnType<typeof vi.fn>;

describe('APIClient', () => {
  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('baseURL', () => {
    it('returns the API base URL', () => {
      expect(apiClient.baseURL).toBe(baseUrl);
    });
  });

  describe('get', () => {
    it('calls fetch with correct URL and GET method', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ id: 1 }), { status: 200 })
      );

      await apiClient.get<{ id: number }>('users/1');

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}users/1`,
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('appends query params to URL', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify([]), { status: 200 })
      );

      await apiClient.get('users', { page: 1, limit: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}users?page=1&limit=10`,
        expect.any(Object)
      );
    });

    it('filters out null/undefined params', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify([]), { status: 200 })
      );

      await apiClient.get('users', { a: 1, b: undefined, c: undefined });

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}users?a=1`,
        expect.any(Object)
      );
    });

    it('handles array params', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify([]), { status: 200 })
      );

      await apiClient.get('users', { ids: [1, 2, 3] });

      const callUrl = (mockFetch.mock.calls[0] as unknown[])[0] as string;
      expect(callUrl).toContain('ids=1');
      expect(callUrl).toContain('ids=2');
      expect(callUrl).toContain('ids=3');
    });

    it('returns parsed JSON on success', async () => {
      const data = { id: 1, name: 'test' };
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify(data), { status: 200 })
      );

      const result = await apiClient.get<typeof data>('users/1');

      expect(result).toEqual(data);
    });

    it('returns empty object on 204 No Content', async () => {
      mockFetch.mockResolvedValue(new Response(undefined, { status: 204 }));

      const result = await apiClient.get('empty');

      expect(result).toEqual({});
    });
  });

  describe('post', () => {
    it('calls fetch with POST method and JSON body', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ id: 1 }), { status: 200 })
      );

      await apiClient.post('users', { name: 'John' });

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}users`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'John' }),
        })
      );
    });
  });

  describe('put', () => {
    it('calls fetch with PUT method and JSON body', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ id: 1 }), { status: 200 })
      );

      await apiClient.put('users/1', { name: 'Jane' });

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}users/1`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'Jane' }),
        })
      );
    });
  });

  describe('delete', () => {
    it('calls fetch with DELETE method', async () => {
      mockFetch.mockResolvedValue(new Response(undefined, { status: 204 }));

      await apiClient.delete('users/1');

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}users/1`,
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('error handling', () => {
    it('throws HttpError with status and message from JSON body', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Not found' }), { status: 404 })
      );

      try {
        await apiClient.get('missing');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error).toMatchObject({ status: 404, message: 'Not found' });
      }
    });

    it('uses json.error when message is missing', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ error: 'Server error' }), {
          status: 500,
        })
      );

      await expect(apiClient.get('error')).rejects.toMatchObject({
        status: 500,
        message: 'Server error',
      });
    });

    it('falls back to response text when body is not JSON', async () => {
      mockFetch.mockResolvedValue(
        new Response('plain text error', {
          status: 400,
          statusText: 'Bad Request',
        })
      );

      await expect(apiClient.get('bad')).rejects.toMatchObject({
        status: 400,
        message: 'plain text error',
      });
    });

    it('uses error text when JSON parse fails', async () => {
      mockFetch.mockResolvedValue(
        new Response('not json at all', { status: 500 })
      );

      await expect(apiClient.get('bad')).rejects.toMatchObject({
        status: 500,
        message: 'not json at all',
      });
    });

    it('falls back to statusText when JSON has no message or error', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ code: 42 }), {
          status: 422,
          statusText: 'Unprocessable Entity',
        })
      );

      await expect(apiClient.get('bad')).rejects.toMatchObject({
        status: 422,
        message: 'Unprocessable Entity',
      });
    });

    it('falls back to statusText when response body is empty', async () => {
      mockFetch.mockResolvedValue(
        new Response('', { status: 503, statusText: 'Service Unavailable' })
      );

      await expect(apiClient.get('down')).rejects.toMatchObject({
        status: 503,
        message: 'Service Unavailable',
      });
    });

    it('redirects to /login on 401 when window is defined', async () => {
      const locationStub = { href: '' };
      vi.stubGlobal('location', locationStub);

      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
        })
      );

      await expect(apiClient.get('protected')).rejects.toThrow(HttpError);
      expect(locationStub.href).toBe('/login');
    });
  });

  describe('getDownloadUrl', () => {
    it('builds URL with base and path', () => {
      const url = apiClient.getDownloadUrl('files/1');
      expect(url).toBe(`${baseUrl}files/1`);
    });

    it('appends params to URL', () => {
      const url = apiClient.getDownloadUrl('files/1', { token: 'abc' });
      expect(url).toBe(`${baseUrl}files/1?token=abc`);
    });

    it('handles array params', () => {
      const url = apiClient.getDownloadUrl('export', { ids: [1, 2] });
      expect(url).toContain('ids=1');
      expect(url).toContain('ids=2');
    });
  });
});

describe('HttpError', () => {
  it('extends Error with status property', () => {
    const error = new HttpError(404, 'Not found');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpError);
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
  });
});
