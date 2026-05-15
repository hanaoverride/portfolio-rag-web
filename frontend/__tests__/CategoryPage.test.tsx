import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import type { Content } from "@/lib/api/types";

// ── Mocks ──────────────────────────────────────────────

const mockGetContentsByCategory = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api/contents", () => ({
  getContentsByCategory: mockGetContentsByCategory,
}));

vi.mock("lucide-react", () => ({
  ArrowUpDown: () => <svg data-testid="icon-arrow-up-down" />,
  Clock: () => <svg data-testid="icon-clock" />,
  Eye: () => <svg data-testid="icon-eye" />,
  TrendingUp: () => <svg data-testid="icon-trending-up" />,
}));

vi.mock("@/lib/hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: true })),
}));

vi.mock("@/lib/hooks/useBookmarks", () => ({
  useBookmarks: vi.fn(() => ({ 
    bookmarkedIds: new Set(),
    addBookmark: vi.fn(),
    removeBookmark: vi.fn()
  })),
}));

vi.mock("@/lib/hooks", () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: true })),
  useBookmarks: vi.fn(() => ({ 
    bookmarkedIds: new Set(),
    addBookmark: vi.fn(),
    removeBookmark: vi.fn()
  })),
}));

vi.mock("@/components/common/ContentCard", () => ({
  ContentCard: ({ content }: { content: Content }) => (
    <div data-testid={`content-card-${content.id}`}>{content.title}</div>
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
    onRetry: () => void;
  }) => (
    <div data-testid="error-message">
      <h3>{title}</h3>
      <p>{message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

// ── Import after mocks ─────────────────────────────────

import CategoryPageClient from "@/app/category/[slug]/CategoryPageClient";

// ── Helpers ────────────────────────────────────────────

function makeMockContent(id: string, title: string): Content {
  return {
    id,
    title,
    description: `Description for ${title}`,
    thumbnail: `/thumb-${id}.jpg`,
    videoUrl: `https://example.com/${id}`,
    category: ["Tech"],
    author: { name: "Author", avatar: "/avatar.jpg" },
    duration: 120,
    views: 50,
    createdAt: "2024-01-01T00:00:00Z",
    tableOfContents: [],
    bodyContent: "",
    relatedContents: [],
  };
}

// ── Tests ──────────────────────────────────────────────

describe("CategoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Loading state ──────────────────────────────────

  it("renders loading spinner on initial render", () => {
    // Keep promises pending so loading state persists
    mockGetContentsByCategory.mockReturnValue(new Promise<never>(() => {}));

    render(<CategoryPageClient slug="tech" categoryName="Technology" />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  // ── Error state ────────────────────────────────────

  it("renders error message when contents fetch fails", async () => {
    mockGetContentsByCategory.mockRejectedValue(new Error("Not found"));

    render(<CategoryPageClient slug="tech" categoryName="Technology" />);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });

    expect(
      screen.getByText("카테고리를 불러올 수 없습니다")
    ).toBeInTheDocument();
    expect(screen.getByText("Not found")).toBeInTheDocument();
  });

  // ── Success state ──────────────────────────────────

  it("renders category header when data loads successfully", async () => {
    const mockContents = [
      makeMockContent("1", "Content Alpha"),
      makeMockContent("2", "Content Beta"),
    ];

    mockGetContentsByCategory.mockResolvedValue({
      items: mockContents,
      total: 2,
    });

    render(<CategoryPageClient slug="tech" categoryName="Technology" />);

    await waitFor(() => {
      expect(screen.getByText("Technology")).toBeInTheDocument();
    });

    const totalText = await screen.findByText(/총/);
    expect(totalText.parentElement).toHaveTextContent(/총\s*2\s*개의 콘텐츠/);
    expect(screen.getByTestId("content-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("content-card-2")).toBeInTheDocument();
  });

  it("renders empty state when there are no contents", async () => {
    mockGetContentsByCategory.mockResolvedValue({ items: [], total: 0 });

    render(<CategoryPageClient slug="tech" categoryName="Technology" />);

    await waitFor(() => {
      expect(screen.getByText("Technology")).toBeInTheDocument();
    });

    expect(screen.getByText("콘텐츠가 없습니다")).toBeInTheDocument();
    expect(
      screen.getByText("이 카테고리에 아직 등록된 콘텐츠가 없습니다.")
    ).toBeInTheDocument();
  });

  it("renders sort buttons", async () => {
    const mockContents = [makeMockContent("1", "Content 1")];

    mockGetContentsByCategory.mockResolvedValue({
      items: mockContents,
      total: 1,
    });

    render(<CategoryPageClient slug="tech" categoryName="Tech" />);

    await waitFor(() => {
      expect(screen.getByText("최신순")).toBeInTheDocument();
    });

    expect(screen.getByText("인기순")).toBeInTheDocument();
    expect(screen.getByText("조회수순")).toBeInTheDocument();
  });

  it("does NOT render pagination when total is less than PAGE_SIZE", async () => {
    const mockContents = [makeMockContent("1", "Content 1")];

    mockGetContentsByCategory.mockResolvedValue({
      items: mockContents,
      total: 1,
    });

    render(<CategoryPageClient slug="tech" categoryName="Tech" />);

    await waitFor(() => {
      expect(screen.getByText("Tech")).toBeInTheDocument();
    });

    expect(screen.queryByText("이전")).not.toBeInTheDocument();
    expect(screen.queryByText("다음")).not.toBeInTheDocument();
  });
});
