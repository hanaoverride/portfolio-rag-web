"use client";

import { useState, useEffect, useCallback } from 'react';
import type { AuthTokens, UserProfile } from '../api/types';
import {
  loginWithEmail,
  loginWithGoogle,
  register as registerApi,
  logout as logoutApi,
  refreshToken,
  fetchCurrentUser,
} from '../api/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const COOKIE_NAME = 'auth_token';

function setAuthCookie(token: string | null): void {
  if (typeof document === 'undefined') return;
  if (token) {
    document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=86400; SameSite=Lax`;
  } else {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  }
}

interface UseAuthReturn {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

function getStoredAuth(): { token: string | null; user: UserProfile | null } {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const user = userStr ? (JSON.parse(userStr) as UserProfile) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

function setStoredAuth(token: string | null, user: UserProfile | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    setAuthCookie(token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    setAuthCookie(null);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
  // Dispatch custom event so other useAuth instances in the same tab re-sync.
  // This is necessary because Next.js layouts persist across navigations,
  // so the Header's useAuth instance never remounts and misses localStorage changes.
  window.dispatchEvent(new CustomEvent('auth-state-changed'));
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { token, user: storedUser } = getStoredAuth();

    // Optimistically set the user from storage for immediate UI rendering
    if (storedUser) {
      setUser(storedUser);
      if (token) {
        setAuthCookie(token);
      }
    }

    // Always verify the session if we have a token
    if (token) {
      setIsLoading(true);
      fetchCurrentUser(token)
        .then((userData) => {
          setUser(userData);
          setStoredAuth(token, userData);
          setAuthCookie(token);
        })
        .catch((err) => {
          // If the error is 401 (Unauthorized) or the server is down/token invalid, clear state
          console.error('Session verification failed:', err);
          setStoredAuth(null, null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
      return;
    }

    setIsLoading(false);
  }, []);

  // Sync with cross-tab storage changes
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === TOKEN_KEY || e.key === USER_KEY) {
        const { user: storedUser } = getStoredAuth();
        setUser(storedUser);
      }
    }
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync with same-tab auth changes.
  // The native storage event only fires for cross-tab changes, so we dispatch a
  // custom event from setStoredAuth to notify other useAuth instances within the
  // same tab (critical for Next.js layouts that persist across page navigations).
  useEffect(() => {
    function handleAuthChange() {
      const { user: storedUser } = getStoredAuth();
      setUser(storedUser);
      setIsLoading(false);
    }
    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => window.removeEventListener('auth-state-changed', handleAuthChange);
  }, []);

  // Listen for global unauthorized events (401)
  useEffect(() => {
    function handleUnauthorized() {
      setStoredAuth(null, null);
      setUser(null);
    }
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginWithEmail({ email, password });
      let userData = result.user;
      if (!userData) {
        try {
          userData = await fetchCurrentUser(result.accessToken);
        } catch {}
      }
      setStoredAuth(result.accessToken, userData ?? null);
      setUser(userData ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogleFn = useCallback(async (idToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginWithGoogle({ idToken });
      let userData = result.user;
      if (!userData) {
        try {
          userData = await fetchCurrentUser(result.accessToken);
        } catch {}
      }
      setStoredAuth(result.accessToken, userData ?? null);
      setUser(userData ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registerApi({ email, password, displayName });
      let userData = result.user;
      if (!userData) {
        try {
          userData = await fetchCurrentUser(result.accessToken);
        } catch {}
      }
      setStoredAuth(result.accessToken, userData ?? null);
      setUser(userData ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutApi();
    } catch { } finally {
      setStoredAuth(null, null);
      setAuthCookie(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    loginWithGoogle: loginWithGoogleFn,
    register,
    logout,
    clearError,
  };
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export async function refreshAuthToken(): Promise<AuthTokens | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    return await refreshToken(token);
  } catch {
    setStoredAuth(null, null);
    return null;
  }
}
