import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchPage from "@/app/search/page";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock hooks
vi.mock("@/lib/hooks", () => ({
  useContents: () => ({
    contents: [],
    total: 0,
    isLoading: false,
    error: null,
    fetchContents: vi.fn(),
    fetchContentById: vi.fn(),
    searchContents: vi.fn(),
    clearError: vi.fn(),
  }),
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
  }),
  useBookmarks: () => ({
    bookmarks: [],
    total: 0,
    isLoading: false,
    error: null,
    fetchBookmarks: vi.fn(),
    addBookmark: vi.fn().mockResolvedValue(true),
    removeBookmark: vi.fn().mockResolvedValue(true),
    clearError: vi.fn(),
  }),
}));

// Mock child components to avoid deep imports
vi.mock("@/components/common/ContentCard", () => ({
  ContentCard: ({ content }: { content: { id: string; title: string } }) => (
    <div data-testid="content-card">{content.title}</div>
  ),
}));

vi.mock("@/components/common/LoadingSpinner", () => ({
  LoadingSpinner: ({ size }: { size?: string }) => (
    <div data-testid="loading-spinner" data-size={size}>
      Loading...
    </div>
  ),
}));

vi.mock("@/components/common/ErrorMessage", () => ({
  ErrorMessage: ({
    title,
    message,
    onRetry,
  }: {
    title: string;
    message: string;
    onRetry?: () => void;
  }) => (
    <div data-testid="error-message">
      <h3>{title}</h3>
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  ),
}));

describe("SearchPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders the search page header", () => {
    render(<SearchPage />);
    expect(screen.getByText("검색")).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<SearchPage />);
    expect(
      screen.getByPlaceholderText("검색어를 입력하세요...")
    ).toBeInTheDocument();
  });

  it("renders empty state when no query is present", () => {
    render(<SearchPage />);
    expect(screen.getByText("검색어를 입력하세요")).toBeInTheDocument();
  });
});
