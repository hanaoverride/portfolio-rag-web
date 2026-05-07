import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

const mockShowToast = vi.fn();
const mockPush = vi.fn();
const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockClearError = vi.fn();
const mockLoginWithGoogle = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: () => null }),
}));

vi.mock('@/lib/hooks', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
    loginWithGoogle: mockLoginWithGoogle,
    logout: vi.fn(),
    isLoading: false,
    error: null,
    isAuthenticated: false,
    user: null,
    clearError: mockClearError,
  }),
  useToast: () => ({ showToast: mockShowToast }),
}));

vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => children,
  GoogleLogin: () => <div data-testid="google-login">Google Login</div>,
}));

import LoginPage from '@/app/login/page';

describe('LoginPage Toast Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls showToast on login success', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    const submitButton = screen.getAllByRole('button', { name: '로그인' })[1];

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('로그인되었습니다', 'success');
    });
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('calls showToast on login error', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    const submitButton = screen.getAllByRole('button', { name: '로그인' })[1];

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Invalid credentials', 'error');
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('calls showToast on register success', async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    render(<LoginPage />);

    const registerTab = screen.getByRole('button', { name: '회원가입' });
    fireEvent.click(registerTab);

    const nameInput = screen.getByLabelText('이름');
    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    const submitButton = screen.getAllByRole('button', { name: '회원가입' })[1];

    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('회원가입이 완료되었습니다', 'success');
    });
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('calls showToast on register error', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Email already registered'));
    render(<LoginPage />);

    const registerTab = screen.getByRole('button', { name: '회원가입' });
    fireEvent.click(registerTab);

    const nameInput = screen.getByLabelText('이름');
    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    const submitButton = screen.getAllByRole('button', { name: '회원가입' })[1];

    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Email already registered', 'error');
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
