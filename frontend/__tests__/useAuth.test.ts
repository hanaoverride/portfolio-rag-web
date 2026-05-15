import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock the auth module
vi.mock('@/lib/api/auth', () => ({
  loginWithEmail: vi.fn(),
  loginWithGoogle: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  fetchCurrentUser: vi.fn(),
}));

import { loginWithEmail, fetchCurrentUser } from '@/lib/api/auth';
import { useAuth } from '@/lib/hooks/useAuth';
import { renderHook, act } from '@testing-library/react';

describe('useAuth', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('starts with not authenticated', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('sets user after successful login', async () => {
    const mockUser = {
      id: 1,
      email: "test@test.com",
      displayName: "Test",
      isAdmin: false,
      role: "user" as const,
      createdAt: new Date().toISOString(),
    };
    vi.mocked(loginWithEmail).mockResolvedValueOnce({
      accessToken: 'token',
      tokenType: 'Bearer',
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@test.com', 'pass');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('test@test.com');
  });

  it('calls /auth/me when result.user is missing', async () => {
    const mockUser = {
      id: 1,
      email: "test@test.com",
      displayName: "Test",
      isAdmin: false,
      role: "user" as const,
      createdAt: new Date().toISOString(),
    };
    vi.mocked(loginWithEmail).mockResolvedValueOnce({
      accessToken: 'token',
      tokenType: 'Bearer',
      user: undefined as any,
    });
    vi.mocked(fetchCurrentUser).mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@test.com', 'pass');
    });

    expect(fetchCurrentUser).toHaveBeenCalledOnce();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles login failure', async () => {
    vi.mocked(loginWithEmail).mockRejectedValueOnce(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.login('test@test.com', 'wrong');
      } catch { /* expected */ }
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('calls /auth/me when result.user is missing on register', async () => {
    const mockUser = {
      id: 1,
      email: "new@test.com",
      displayName: "NewUser",
      isAdmin: false,
      role: "user" as const,
      createdAt: new Date().toISOString(),
    };
    vi.mocked(fetchCurrentUser).mockResolvedValueOnce(mockUser);

    const { register } = await import('@/lib/api/auth');
    vi.mocked(register).mockResolvedValueOnce({
      accessToken: 'token',
      tokenType: 'Bearer',
      user: undefined as any,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register('new@test.com', 'password123', 'NewUser');
    });

    expect(fetchCurrentUser).toHaveBeenCalledOnce();
    expect(result.current.isAuthenticated).toBe(true);
  });
});