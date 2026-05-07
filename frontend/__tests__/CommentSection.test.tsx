import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { CommentSection } from "@/components/content/CommentSection";
import * as commentsApi from "@/lib/api/comments";
import * as useAuth from "@/lib/hooks/useAuth";

vi.mock("@/lib/api/comments", () => ({
  getComments: vi.fn(),
  addComment: vi.fn(),
  deleteComment: vi.fn(),
}));

vi.mock("@/lib/hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({ user: null, isAuthenticated: false, isLoading: false, error: null, login: vi.fn(), loginWithGoogle: vi.fn(), register: vi.fn(), logout: vi.fn(), clearError: vi.fn() })),
  getAuthToken: vi.fn(),
}));

const mockGetComments = commentsApi.getComments as ReturnType<typeof vi.fn>;

describe("CommentSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth.getAuthToken).mockReturnValue(null);
  });

  it("renders comment section with header", () => {
    mockGetComments.mockResolvedValue({
      items: [],
      total: 0,
      limit: 20,
      offset: 0,
    });

    render(<CommentSection contentId="content-123" />);

    expect(screen.getByText("댓글")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("displays empty state message when no comments", async () => {
    mockGetComments.mockResolvedValue({
      items: [],
      total: 0,
      limit: 20,
      offset: 0,
    });

    render(<CommentSection contentId="content-123" />);

    await waitFor(() => {
      expect(screen.getByText("아직 댓글이 없습니다. 첫 댓글을 작성해보세요!")).toBeInTheDocument();
    });
  });

  it("displays comments list when comments exist", async () => {
    const mockComments = [
      {
        id: 1,
        contentId: "content-123",
        userId: 10,
        text: "첫 번째 댓글입니다",
        authorName: "사용자1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        contentId: "content-123",
        userId: 20,
        text: "두 번째 댓글입니다",
        authorName: "사용자2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    mockGetComments.mockResolvedValue({
      items: mockComments,
      total: 2,
      limit: 20,
      offset: 0,
    });

    render(<CommentSection contentId="content-123" />);

    await waitFor(() => {
      expect(screen.getByText("첫 번째 댓글입니다")).toBeInTheDocument();
      expect(screen.getByText("두 번째 댓글입니다")).toBeInTheDocument();
      expect(screen.getByText("사용자1")).toBeInTheDocument();
      expect(screen.getByText("사용자2")).toBeInTheDocument();
    });
  });

  it("shows comment count correctly", async () => {
    const mockComments = [
      {
        id: 1,
        contentId: "content-123",
        userId: 10,
        text: "댓글 하나",
        authorName: "사용자",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    mockGetComments.mockResolvedValue({
      items: mockComments,
      total: 5,
      limit: 20,
      offset: 0,
    });

    render(<CommentSection contentId="content-123" />);

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });

  it("shows login required message when not authenticated", async () => {
    mockGetComments.mockResolvedValue({
      items: [],
      total: 0,
      limit: 20,
      offset: 0,
    });

    render(<CommentSection contentId="content-123" />);

    await waitFor(() => {
      expect(screen.getByText("댓글을 작성하려면 로그인이 필요합니다")).toBeInTheDocument();
    });
  });
});