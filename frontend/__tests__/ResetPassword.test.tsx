import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordPage from "@/app/reset-password/page";

// Mock next/navigation
const mockPush = vi.fn();
const mockGet = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock the auth API
vi.mock("@/lib/api/auth", () => ({
  resetPasswordConfirm: vi.fn(),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Lock: () => <svg data-testid="lock-icon" />,
  Eye: () => <svg data-testid="eye-icon" />,
  EyeOff: () => <svg data-testid="eyeoff-icon" />,
  CheckCircle: () => <svg data-testid="check-circle-icon" />,
}));

import { resetPasswordConfirm } from "@/lib/api/auth";

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue("valid-reset-token");
  });

  it("renders the reset password form", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByText("새 비밀번호를 설정해주세요")).toBeInTheDocument();
    expect(screen.getByLabelText("새 비밀번호")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호 확인")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "비밀번호 변경" })).toBeInTheDocument();
  });

  it("shows validation error when password is too short", async () => {
    render(<ResetPasswordPage />);
    const passwordInput = screen.getByLabelText("새 비밀번호");
    const submitButton = screen.getByRole("button", { name: "비밀번호 변경" });

    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("비밀번호는 8자 이상이어야 합니다")).toBeInTheDocument();
    });
  });

  it("shows validation error when passwords do not match", async () => {
    render(<ResetPasswordPage />);
    const passwordInput = screen.getByLabelText("새 비밀번호");
    const confirmInput = screen.getByLabelText("비밀번호 확인");
    const submitButton = screen.getByRole("button", { name: "비밀번호 변경" });

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "different123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("비밀번호가 일치하지 않습니다")).toBeInTheDocument();
    });
  });

  it("shows validation error when confirm password is empty", async () => {
    render(<ResetPasswordPage />);
    const passwordInput = screen.getByLabelText("새 비밀번호");
    const submitButton = screen.getByRole("button", { name: "비밀번호 변경" });

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("비밀번호 확인을 입력해주세요")).toBeInTheDocument();
    });
  });

  it("calls resetPasswordConfirm and shows success on valid submission", async () => {
    const mockResetConfirm = resetPasswordConfirm as ReturnType<typeof vi.fn>;
    mockResetConfirm.mockResolvedValueOnce({ message: "Password reset successful" });

    render(<ResetPasswordPage />);
    const passwordInput = screen.getByLabelText("새 비밀번호");
    const confirmInput = screen.getByLabelText("비밀번호 확인");
    const submitButton = screen.getByRole("button", { name: "비밀번호 변경" });

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmInput, { target: { value: "newpassword123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockResetConfirm).toHaveBeenCalledWith({
        token: "valid-reset-token",
        newPassword: "newpassword123",
      });
    });

    await waitFor(() => {
      expect(screen.getByText("비밀번호가 변경되었습니다")).toBeInTheDocument();
    });
  });

  it("shows error message when API call fails", async () => {
    const mockResetConfirm = resetPasswordConfirm as ReturnType<typeof vi.fn>;
    mockResetConfirm.mockRejectedValueOnce(new Error("토큰이 만료되었습니다"));

    render(<ResetPasswordPage />);
    const passwordInput = screen.getByLabelText("새 비밀번호");
    const confirmInput = screen.getByLabelText("비밀번호 확인");
    const submitButton = screen.getByRole("button", { name: "비밀번호 변경" });

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmInput, { target: { value: "newpassword123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("토큰이 만료되었습니다")).toBeInTheDocument();
    });
  });

  it("shows generic error when API call fails without message", async () => {
    const mockResetConfirm = resetPasswordConfirm as ReturnType<typeof vi.fn>;
    mockResetConfirm.mockRejectedValueOnce(new Error());

    render(<ResetPasswordPage />);
    const passwordInput = screen.getByLabelText("새 비밀번호");
    const confirmInput = screen.getByLabelText("비밀번호 확인");
    const submitButton = screen.getByRole("button", { name: "비밀번호 변경" });

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmInput, { target: { value: "newpassword123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("비밀번호 재설정에 실패했습니다")).toBeInTheDocument();
    });
  });

  it("shows invalid link message when token is missing", () => {
    mockGet.mockReturnValue(null);
    render(<ResetPasswordPage />);

    expect(screen.getByText(/유효하지 않은 링크입니다/)).toBeInTheDocument();
  });

  it("disables submit button when token is missing", () => {
    mockGet.mockReturnValue(null);
    render(<ResetPasswordPage />);

    const submitButton = screen.getByRole("button", { name: "비밀번호 변경" });
    expect(submitButton).toBeDisabled();
  });

  it("has a link back to login page", () => {
    render(<ResetPasswordPage />);
    const loginLink = screen.getByText("로그인으로 돌아가기");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest("a")).toHaveAttribute("href", "/login");
  });

  it("has a link to Layer homepage", () => {
    render(<ResetPasswordPage />);
    const homeLink = screen.getByText("Layer").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("shows success message after valid submission", async () => {
    const mockResetConfirm = resetPasswordConfirm as ReturnType<typeof vi.fn>;
    mockResetConfirm.mockResolvedValueOnce({ message: "Password reset successful" });

    render(<ResetPasswordPage />);
    const passwordInput = screen.getByLabelText("새 비밀번호");
    const confirmInput = screen.getByLabelText("비밀번호 확인");
    const submitButton = screen.getByRole("button", { name: "비밀번호 변경" });

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmInput, { target: { value: "newpassword123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("비밀번호가 변경되었습니다")).toBeInTheDocument();
    });

    expect(screen.getByText("로그인하러 가기")).toBeInTheDocument();
  });
});