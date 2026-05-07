import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError, fetchApi } from '@/lib/api/client';

describe('ApiError', () => {
  it('creates with message, status, and data', () => {
    const error = new ApiError('test', 400, { detail: 'err' });
    expect(error.message).toBe('test');
    expect(error.status).toBe(400);
    expect(error.data).toEqual({ detail: 'err' });
    expect(error.name).toBe('ApiError');
  });
});

describe('fetchApi error handling', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('extracts string detail from 401 response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 401, statusText: 'Unauthorized',
      json: () => Promise.resolve({ detail: 'Invalid credentials' }),
      text: () => Promise.resolve(''),
      headers: new Headers(),
    });
    try { await fetchApi('/test'); expect.fail('Should have thrown'); }
    catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toBe('Invalid credentials');
      expect((err as ApiError).status).toBe(401);
    }
  });

  it('handles 422 array detail from FastAPI validation', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 422, statusText: 'Unprocessable Entity',
      json: () => Promise.resolve({ detail: [{ msg: 'field required', loc: ['body', 'email'], type: 'missing' }] }),
      text: () => Promise.resolve(''),
      headers: new Headers(),
    });
    try { await fetchApi('/test'); expect.fail('Should have thrown'); }
    catch (err) {
      expect((err as ApiError).message).toContain('field required');
    }
  });

  it('joins multiple 422 validation messages', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 422, statusText: 'Unprocessable Entity',
      json: () => Promise.resolve({ detail: [{ msg: 'err1' }, { msg: 'err2' }] }),
      text: () => Promise.resolve(''),
      headers: new Headers(),
    });
    try { await fetchApi('/test'); expect.fail('Should have thrown'); }
    catch (err) {
      expect((err as ApiError).message).toBe('err1; err2');
    }
  });

  it('falls back to status text when no detail', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 500, statusText: 'Internal Server Error',
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      headers: new Headers(),
    });
    try { await fetchApi('/test'); expect.fail('Should have thrown'); }
    catch (err) {
      expect((err as ApiError).message).toContain('500');
    }
  });

  it('handles non-JSON response gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 502, statusText: 'Bad Gateway',
      json: () => Promise.reject(new Error('not json')),
      text: () => Promise.resolve('plain text error'),
      headers: new Headers(),
    });
    try { await fetchApi('/test'); expect.fail('Should have thrown'); }
    catch (err) {
      expect((err as ApiError).message).toContain('502');
    }
  });

  it('handles network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    try { await fetchApi('/test'); expect.fail('Should have thrown'); }
    catch (err) {
      expect(err).toBeInstanceOf(TypeError);
      expect((err as Error).message).toBe('Failed to fetch');
    }
  });
});
