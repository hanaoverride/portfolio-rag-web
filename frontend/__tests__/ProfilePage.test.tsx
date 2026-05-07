import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfilePage from "@/app/profile/page";
import * as useAuthModule from "@/lib/hooks/useAuth";

// jsdom does not implement window.matchMedia — required by ThemeToggle in Header
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock("@/lib/hooks/useAuth", () => ({
  useAuth: vi.fn(),
  getAuthToken: vi.fn(),
  refreshAuthToken: vi.fn(),
}));

vi.mock("@/lib/api/categories", () => ({
  getCategories: vi.fn().mockResolvedValue([]),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  } & Record<string, unknown>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

const mockUseAuth = vi.mocked(useAuthModule.useAuth);

const mockUser = {
  id: 1,
  email: "test@example.com",
  displayName: "테스트 사용자",
  createdAt: "2024-01-15T09:30:00Z",
};

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loading state", () => {
    it("shows loading spinner when isLoading is true", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
      });

      render(<ProfilePage />);

      expect(screen.getByLabelText("로딩 중")).toBeInTheDocument();
    });
  });

  describe("unauthenticated state", () => {
    it("shows login prompt when user is null", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
      });

      render(<ProfilePage />);

      expect(screen.getByText("로그인이 필요합니다")).toBeInTheDocument();
      expect(screen.getByText("홈으로 이동")).toBeInTheDocument();
    });

    it("links to home page from login prompt", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
      });

      render(<ProfilePage />);

      const homeLink = screen.getByText("홈으로 이동").closest("a");
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });

  describe("authenticated state", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
      });
    });

    it("renders profile page heading", () => {
      render(<ProfilePage />);

      expect(screen.getByText("프로필")).toBeInTheDocument();
      expect(screen.getByText("내 계정 정보")).toBeInTheDocument();
    });

    it("displays user display name", () => {
      render(<ProfilePage />);

      expect(screen.getByTestId("profile-display-name")).toHaveTextContent(
        "테스트 사용자"
      );
    });

    it("displays user email", () => {
      render(<ProfilePage />);

      expect(screen.getByTestId("profile-email")).toHaveTextContent(
        "test@example.com"
      );
    });

    it("displays user created date", () => {
      render(<ProfilePage />);

      expect(screen.getByTestId("profile-created-at")).toBeInTheDocument();
    });

    it("displays field labels", () => {
      render(<ProfilePage />);

      expect(screen.getByText("표시 이름")).toBeInTheDocument();
      expect(screen.getByText("이메일")).toBeInTheDocument();
      expect(screen.getByText("가입일")).toBeInTheDocument();
    });

    it("displays activity statistics section", () => {
      render(<ProfilePage />);

      expect(screen.getByText("활동 통계")).toBeInTheDocument();
      expect(
        screen.getByText("북마크 수와 댓글 수는 추후 구현 예정입니다.")
      ).toBeInTheDocument();
    });
  });

  describe("user without createdAt", () => {
    it("does not show created date when createdAt is undefined", () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, email: "test@example.com", displayName: "테스트" },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
      });

      render(<ProfilePage />);

      expect(screen.queryByTestId("profile-created-at")).not.toBeInTheDocument();
      expect(screen.queryByText("가입일")).not.toBeInTheDocument();
    });
  });

  describe("renders without MainLayout wrapper", () => {
    it("loads loading state without MainLayout", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
      });

      const { container } = render(<ProfilePage />);
      expect(screen.getByLabelText("로딩 중")).toBeInTheDocument();
      // No <main> wrapper from MainLayout — content is direct child of Fragment
      expect(container.firstChild?.nodeName).not.toBe("MAIN");
    });

    it("loads no-user state without MainLayout", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
      });

      const { container } = render(<ProfilePage />);
      expect(screen.getByText("로그인이 필요합니다")).toBeInTheDocument();
      expect(container.firstChild?.nodeName).not.toBe("MAIN");
    });

    it("loads authenticated state without MainLayout", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
      });

      const { container } = render(<ProfilePage />);
      expect(screen.getByText("프로필")).toBeInTheDocument();
      expect(container.firstChild?.nodeName).not.toBe("MAIN");
    });
  });
});