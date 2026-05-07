"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { resetPasswordConfirm } from "@/lib/api/auth";

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function validatePassword(password: string): string | undefined {
  if (!password) return "비밀번호를 입력해주세요";
  if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다";
  return undefined;
}

function validateConfirmPassword(password: string, confirm: string): string | undefined {
  if (!confirm) return "비밀번호 확인을 입력해주세요";
  if (password !== confirm) return "비밀번호가 일치하지 않습니다";
  return undefined;
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!token) {
        setFormErrors({ general: "유효하지 않은 링크입니다. 비밀번호 재설정 이메일을 다시 요청해주세요." });
        return;
      }

      const errors: FormErrors = {};
      const pwErr = validatePassword(password);
      const cpErr = validateConfirmPassword(password, confirmPassword);
      if (pwErr) errors.password = pwErr;
      if (cpErr) errors.confirmPassword = cpErr;
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setFormErrors({});
      setIsSubmitting(true);
      try {
        await resetPasswordConfirm({ token, newPassword: password });
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (err) {
        const message = err instanceof Error && err.message ? err.message : "비밀번호 재설정에 실패했습니다";
        setFormErrors({ general: message });
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, password, confirmPassword, router]
  );

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 shadow-md text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              비밀번호가 변경되었습니다
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              로그인 페이지로 이동합니다...
            </p>
            <Link
              href="/login"
              className="inline-block rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-fast hover:bg-primary-700"
            >
              로그인하러 가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-0.5">
            <span className="text-3xl font-bold tracking-tight text-primary-600">Layer</span>
          </Link>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            새 비밀번호를 설정해주세요
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-md">
          <div className="p-6">
            {!token && (
              <div className="mb-4 rounded-lg border border-error/20 bg-error-light/50 px-4 py-3 text-sm text-error dark:bg-error/10">
                유효하지 않은 링크입니다. 비밀번호 재설정 이메일을 다시 요청해주세요.
              </div>
            )}

            {formErrors.general && (
              <div className="mb-4 rounded-lg border border-error/20 bg-error-light/50 px-4 py-3 text-sm text-error dark:bg-error/10">
                {formErrors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
                  새 비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="8자 이상의 새 비밀번호"
                    autoComplete="new-password"
                    className={cn(
                      "w-full rounded-lg border bg-neutral-50 px-10 py-2.5 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-fast focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800",
                      formErrors.password
                        ? "border-error"
                        : "border-[var(--color-border)]"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-xs text-error">{formErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (formErrors.confirmPassword) setFormErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    placeholder="비밀번호를 다시 입력하세요"
                    autoComplete="new-password"
                    className={cn(
                      "w-full rounded-lg border bg-neutral-50 px-10 py-2.5 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-fast focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-800",
                      formErrors.confirmPassword
                        ? "border-error"
                        : "border-[var(--color-border)]"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                    aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-error">{formErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !token}
                className={cn(
                  "w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-fast",
                  isSubmitting || !token
                    ? "cursor-not-allowed opacity-60"
                    : "hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                )}
              >
                {isSubmitting ? "변경 중..." : "비밀번호 변경"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="text-sm text-primary-600 hover:text-primary-700 transition-colors duration-fast"
              >
                로그인으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page)]">
          <p className="text-[var(--color-text-muted)]">로딩 중...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}