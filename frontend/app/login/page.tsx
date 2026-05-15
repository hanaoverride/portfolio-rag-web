"use client";

import { Suspense, useState, useCallback } from "react";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, Eye, EyeOff, X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useToast } from "@/lib/hooks";
import { resetPassword } from "@/lib/api/auth";

type Tab = "login" | "register";

interface FormErrors {
  email?: string;
  password?: string;
  displayName?: string;
  general?: string;
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "이메일을 입력해주세요";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "올바른 이메일 형식이 아닙니다";
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return "비밀번호를 입력해주세요";
  if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다";
  return undefined;
}

function validateDisplayName(name: string): string | undefined {
  if (!name.trim()) return "이름을 입력해주세요";
  if (name.trim().length < 2) return "이름은 2자 이상이어야 합니다";
  return undefined;
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register: registerUser, isLoading, error: authError, clearError, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const redirect = searchParams.get('redirect');

  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [debugToken, setDebugToken] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const switchTab = useCallback(
    (newTab: Tab) => {
      setTab(newTab);
      setFormErrors({});
      clearError();
    },
    [clearError]
  );

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const errors: FormErrors = {};
      const emailErr = validateEmail(email);
      const pwErr = validatePassword(password);
      if (emailErr) errors.email = emailErr;
      if (pwErr) errors.password = pwErr;
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      setFormErrors({});
      setIsSubmitting(true);
      try {
        await login(email, password);
        showToast("로그인되었습니다", "success");
        router.push(redirect || "/");
      } catch (err) {
        setFormErrors({
          general: err instanceof Error ? err.message : "로그인에 실패했습니다",
        });
        showToast(err instanceof Error ? err.message : "로그인에 실패했습니다", "error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password, login, router, redirect, showToast]
  );

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const errors: FormErrors = {};
      const emailErr = validateEmail(email);
      const pwErr = validatePassword(password);
      const nameErr = validateDisplayName(displayName);
      if (emailErr) errors.email = emailErr;
      if (pwErr) errors.password = pwErr;
      if (nameErr) errors.displayName = nameErr;
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      setFormErrors({});
      setIsSubmitting(true);
      try {
        await registerUser(email, password, displayName.trim());
        showToast("회원가입이 완료되었습니다", "success");
        router.push(redirect || "/");
      } catch (err) {
        setFormErrors({
          general: err instanceof Error ? err.message : "회원가입에 실패했습니다",
        });
        showToast(err instanceof Error ? err.message : "회원가입에 실패했습니다", "error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password, displayName, registerUser, router, redirect, showToast]
  );

  // Google login is wired via GoogleLogin component; no separate handler needed

  const handleForgotPassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(resetEmail);
    if (emailErr) {
      setResetError(emailErr);
      return;
    }
    setResetError(null);
    setResetLoading(true);
    try {
      const result = await resetPassword({ email: resetEmail });
      if (result.debugToken) {
        setDebugToken(result.debugToken);
      }
      setResetSubmitted(true);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "비밀번호 재설정 요청에 실패했습니다");
    } finally {
      setResetLoading(false);
    }
  }, [resetEmail]);

  const disabled = isSubmitting || isLoading;

  const inputClasses = (hasError?: boolean) => cn(
    "w-full rounded-xl border bg-[var(--color-bg-page)]/60 px-10 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-[var(--color-bg-surface)]",
    hasError ? "border-error" : "border-[var(--color-border)]"
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page)] px-4 py-12">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-0.5">
            <Image
              src="/logo.png"
              alt="Layer"
              width={140}
              height={44}
              className="mx-auto h-11 w-auto"
              priority
            />
          </Link>
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
            콘텐츠의 모든 결 — 영상과 텍스트가 공존하는 플랫폼
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-xl overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-[var(--color-border)] bg-[var(--color-bg-page)]/30">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={cn(
                "flex-1 px-4 py-3.5 text-sm font-semibold transition-all duration-200 relative",
                tab === "login"
                  ? "text-primary-600"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              )}
            >
              로그인
              {tab === "login" && (
                <span className="absolute bottom-0 inset-x-4 h-0.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
              )}
            </button>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className={cn(
                "flex-1 px-4 py-3.5 text-sm font-semibold transition-all duration-200 relative",
                tab === "register"
                  ? "text-primary-600"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              )}
            >
              회원가입
              {tab === "register" && (
                <span className="absolute bottom-0 inset-x-4 h-0.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
              )}
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {(formErrors.general || authError) && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-error/15 bg-error/5 px-4 py-3 text-sm text-error">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{formErrors.general || authError}</span>
              </div>
            )}

            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
                    이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className={inputClasses(!!formErrors.email)}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1.5 text-xs text-error">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="비밀번호를 입력하세요"
                      autoComplete="current-password"
                      className={cn(inputClasses(!!formErrors.password), "pr-10")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                      aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1.5 text-xs text-error">{formErrors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={disabled}
                  className={cn(
                    "w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all duration-200",
                    disabled
                      ? "cursor-not-allowed opacity-60"
                      : "hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/30 active:scale-[0.98]"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      로그인 중...
                    </span>
                  ) : "로그인"}
                </button>

                <div className="text-center">
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-primary-600 hover:text-primary-500 transition-colors duration-200">
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label htmlFor="register-name" className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
                    이름
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                      id="register-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value);
                        if (formErrors.displayName) setFormErrors((prev) => ({ ...prev, displayName: undefined }));
                      }}
                      placeholder="표시할 이름을 입력하세요"
                      autoComplete="name"
                      className={inputClasses(!!formErrors.displayName)}
                    />
                  </div>
                  {formErrors.displayName && (
                    <p className="mt-1.5 text-xs text-error">{formErrors.displayName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
                    이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className={inputClasses(!!formErrors.email)}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1.5 text-xs text-error">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="8자 이상의 비밀번호"
                      autoComplete="new-password"
                      className={cn(inputClasses(!!formErrors.password), "pr-10")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                      aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1.5 text-xs text-error">{formErrors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={disabled}
                  className={cn(
                    "w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all duration-200",
                    disabled
                      ? "cursor-not-allowed opacity-60"
                      : "hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/30 active:scale-[0.98]"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      가입 중...
                    </span>
                  ) : "회원가입"}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--color-bg-surface)] px-3 text-[var(--color-text-muted)]">
                  또는
                </span>
              </div>
            </div>

            <GoogleLogin
              onSuccess={async (credentialResponse: CredentialResponse) => {
                const credential = credentialResponse?.credential;
                if (credential) {
                  try {
                    await loginWithGoogle(credential);
                    router.push(redirect || '/');
                  } catch {
                    setFormErrors({ general: 'Google 로그인에 실패했습니다' });
                  }
                }
              }}
              onError={() => setFormErrors({ general: 'Google 로그인에 실패했습니다' })}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="100%"
            />
          </div>
        </div>

        {/* Forgot password modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowForgotPassword(false)}>
            <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 sm:p-8 shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">비밀번호 재설정</h2>
                <button onClick={() => setShowForgotPassword(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-page)] hover:text-[var(--color-text-secondary)] transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!resetSubmitted ? (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label htmlFor="reset-email" className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
                      이메일
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          if (resetError) setResetError(null);
                        }}
                        placeholder="name@example.com"
                        autoComplete="email"
                        className={inputClasses(!!resetError)}
                      />
                    </div>
                    {resetError && <p className="mt-1.5 text-xs text-error">{resetError}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className={cn(
                      "w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all duration-200",
                      resetLoading ? "cursor-not-allowed opacity-60" : "hover:bg-primary-500 active:scale-[0.98]"
                    )}
                  >
                    {resetLoading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "재설정 요청"}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-primary-500/15 bg-primary-50/50 px-4 py-3 text-sm text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                    이메일이 전송되었습니다. 받은편지함을 확인해주세요.
                  </div>
                  {debugToken && (
                    <div className="rounded-xl border border-warning/15 bg-warning-light/50 px-4 py-3 text-sm text-warning dark:bg-warning/10">
                      <strong>임시 비밀번호 재설정 토큰:</strong><br />
                      <code className="mt-1 block font-mono text-xs">{debugToken}</code>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSubmitted(false);
                      setResetEmail("");
                      setDebugToken(null);
                    }}
                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-page)] transition-colors"
                  >
                    닫기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
