import type {
  AuthTokens,
  RegisterRequest,
  EmailLoginRequest,
  GoogleLoginRequest,
  PasswordResetRequest,
  PasswordResetConfirmation,
  PasswordResetInitResponse,
  UserProfile,
} from './types';
import { getAuthToken } from '@/lib/hooks/useAuth';

export async function register(
  data: RegisterRequest
): Promise<AuthTokens> {
  const { fetchApi } = await import('./client');
  return fetchApi('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginWithEmail(
  data: EmailLoginRequest
): Promise<AuthTokens> {
  const { fetchApi } = await import('./client');
  return fetchApi('/api/v1/auth/login/email', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginWithGoogle(
  data: GoogleLoginRequest
): Promise<AuthTokens> {
  const { fetchApi } = await import('./client');
  return fetchApi('/api/v1/auth/login/google', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function resetPassword(
  data: PasswordResetRequest
): Promise<PasswordResetInitResponse> {
  const { fetchApi } = await import('./client');
  return fetchApi('/api/v1/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function resetPasswordConfirm(
  data: PasswordResetConfirmation
): Promise<{ message: string }> {
  const { fetchApi } = await import('./client');
  return fetchApi('/api/v1/auth/password/confirm', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<void> {
  const { fetchApi } = await import('./client');
  const token = getAuthToken();
  return fetchApi('/api/v1/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function fetchCurrentUser(token?: string): Promise<UserProfile> {
  const { fetchApi } = await import('./client');
  const actualToken = token || getAuthToken();
  return fetchApi('/api/v1/auth/me', { token: actualToken || undefined });
}

export async function refreshToken(token: string): Promise<AuthTokens> {
  const { fetchApi } = await import('./client');
  return fetchApi('/api/v1/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
}