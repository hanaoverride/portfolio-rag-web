import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import { Header } from "@/components/layout/Header";
import type { Category, Content } from "@/lib/api/types";
import * as categoriesApi from "@/lib/api/categories";
import * as contentsApi from "@/lib/api/contents";

vi.mock("@/lib/api/categories", () => ({
  getCategories: vi.fn(),
}));

vi.mock("@/lib/api/contents", () => ({
  getContents: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockCategories: Category[] = [
  { id: "1", name: "IT/Programming", slug: "it-programming" },
  { id: "2", name: "Design", slug: "design" },
  { id: "3", name: "Business", slug: "business" },
];

const mockContents: Content[] = [
  {
    id: "content-1",
    title: "React Hooks Deep Dive",
    description: "Learn advanced React patterns",
    thumbnail: "https://example.com/thumb1.jpg",
    videoUrl: "https://youtube.com/watch?v=1",
    category: ["IT/Programming"],
    author: { name: "김개발", avatar: "https://example.com/avatar1.jpg" },
    duration: 1200,
    views: 5000,
    createdAt: "2024-01-01T00:00:00Z",
    tableOfContents: [],
    bodyContent: "",
    relatedContents: [],
    isNew: true,
  },
  {
    id: "content-2",
    title: "TypeScript Best Practices",
    description: "Write better TypeScript code",
    thumbnail: "https://example.com/thumb2.jpg",
    videoUrl: "https://youtube.com/watch?v=2",
    category: ["IT/Programming"],
    author: { name: "박타입", avatar: "https://example.com/avatar2.jpg" },
    duration: 900,
    views: 3000,
    createdAt: "2024-02-01T00:00:00Z",
    tableOfContents: [],
    bodyContent: "",
    relatedContents: [],
  },
];

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
    (
      contentsApi.getContents as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      items: [],
      total: 0,
      limit: 5,
      offset: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("categories prop handling", () => {
    it("does NOT call getCategories when categories prop is provided", async () => {
      (categoriesApi.getCategories as ReturnType<typeof vi.fn>).mockResolvedValue(mockCategories);
      render(<Header categories={mockCategories} />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(categoriesApi.getCategories).not.toHaveBeenCalled();
    });

    it("calls getCategories when categories prop is empty array", async () => {
      (categoriesApi.getCategories as ReturnType<typeof vi.fn>).mockResolvedValue(mockCategories);
      render(<Header categories={[]} />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(categoriesApi.getCategories).toHaveBeenCalledTimes(1);
    });

    it("calls getCategories when categories prop is undefined", async () => {
      (categoriesApi.getCategories as ReturnType<typeof vi.fn>).mockResolvedValue(mockCategories);
      render(<Header />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(categoriesApi.getCategories).toHaveBeenCalledTimes(1);
    });

    it("does not call getCategories multiple times on re-render", async () => {
      (categoriesApi.getCategories as ReturnType<typeof vi.fn>).mockResolvedValue(mockCategories);
      const { rerender } = render(<Header categories={[]} />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(categoriesApi.getCategories).toHaveBeenCalledTimes(1);

      rerender(<Header categories={[]} />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(categoriesApi.getCategories).toHaveBeenCalledTimes(1);
    });
  });

  describe("category dropdown rendering", () => {
    it("renders category dropdown when categories are provided via prop", async () => {
      render(<Header categories={mockCategories} />);

      const button = screen.getByRole("button", { name: /카테고리/ });
      expect(button).toBeInTheDocument();
    });

    it("renders category dropdown when categories are fetched from API", async () => {
      (categoriesApi.getCategories as ReturnType<typeof vi.fn>).mockResolvedValue(mockCategories);
      render(<Header categories={[]} />);

      const button = await screen.findByRole("button", { name: /카테고리/ });
      expect(button).toBeInTheDocument();
    });

    it("does not render category dropdown when no categories and API fails", async () => {
      (categoriesApi.getCategories as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("API Error"));

      render(<Header categories={[]} />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(screen.queryByRole("button", { name: /카테고리/ })).not.toBeInTheDocument();
    });
  });

  describe("onCategorySelect callback", () => {
    it("passes onCategorySelect prop correctly", async () => {
      const handleCategorySelect = vi.fn();
      (categoriesApi.getCategories as ReturnType<typeof vi.fn>).mockResolvedValue(mockCategories);

      const { container } = render(
        <Header categories={mockCategories} onCategorySelect={handleCategorySelect} />
      );

      expect(container.querySelector('[data-state="closed"]')).toBeTruthy();
    });
  });

  describe("search behavior", () => {
    it("triggers debounced content fetch when typing in search", async () => {
      const mockGetContents = vi.fn().mockResolvedValue({
        items: mockContents,
        total: 2,
        limit: 5,
        offset: 0,
      });
      (contentsApi.getContents as ReturnType<typeof vi.fn>).mockImplementation(mockGetContents);

      render(<Header categories={mockCategories} />);

      const input = screen.getByPlaceholderText("콘텐츠 검색...");
      fireEvent.change(input, { target: { value: "react" } });

      await waitFor(
        () => {
          expect(mockGetContents).toHaveBeenCalledWith({
            search: "react",
            limit: 5,
          });
        },
        { timeout: 500 }
      );
    });

    it("displays search results in dropdown", async () => {
      (contentsApi.getContents as ReturnType<typeof vi.fn>).mockResolvedValue({
        items: mockContents,
        total: 2,
        limit: 5,
        offset: 0,
      });

      render(<Header categories={mockCategories} />);

      const input = screen.getByPlaceholderText("콘텐츠 검색...");
      fireEvent.change(input, { target: { value: "typescript" } });

      await waitFor(
        () => {
          expect(screen.getByText("React Hooks Deep Dive")).toBeInTheDocument();
        },
        { timeout: 500 }
      );

      expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument();
      expect(screen.getByText("김개발")).toBeInTheDocument();
      expect(screen.getByText("박타입")).toBeInTheDocument();
    });

    it("navigates to content page when clicking a result", async () => {
      (contentsApi.getContents as ReturnType<typeof vi.fn>).mockResolvedValue({
        items: mockContents,
        total: 2,
        limit: 5,
        offset: 0,
      });

      render(<Header categories={mockCategories} />);

      const input = screen.getByPlaceholderText("콘텐츠 검색...");
      fireEvent.change(input, { target: { value: "react" } });

      const resultButton = await screen.findByText(
        "React Hooks Deep Dive",
        {},
        { timeout: 500 }
      );
      fireEvent.click(resultButton);

      expect(mockPush).toHaveBeenCalledWith("/content/content-1");
    });

    it("closes dropdown when search input is cleared", async () => {
      (contentsApi.getContents as ReturnType<typeof vi.fn>).mockResolvedValue({
        items: mockContents,
        total: 2,
        limit: 5,
        offset: 0,
      });

      render(<Header categories={mockCategories} />);

      const input = screen.getByPlaceholderText("콘텐츠 검색...");
      fireEvent.change(input, { target: { value: "react" } });

      await screen.findByText("React Hooks Deep Dive", {}, { timeout: 500 });

      fireEvent.change(input, { target: { value: "" } });

      await waitFor(() => {
        expect(
          screen.queryByText("React Hooks Deep Dive")
        ).not.toBeInTheDocument();
      });
    });

    it("does not fetch when search query is empty", async () => {
      const mockGetContents = vi.fn().mockResolvedValue({
        items: [],
        total: 0,
        limit: 5,
        offset: 0,
      });
      (contentsApi.getContents as ReturnType<typeof vi.fn>).mockImplementation(mockGetContents);

      render(<Header categories={mockCategories} />);

      const input = screen.getByPlaceholderText("콘텐츠 검색...");
      fireEvent.change(input, { target: { value: "   " } });

      // Wait long enough for any debounced call to have fired
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
      });

      expect(mockGetContents).not.toHaveBeenCalled();
    });

    it("preserves Enter-to-submit search behavior", async () => {
      const onSearch = vi.fn();
      render(
        <Header categories={mockCategories} onSearch={onSearch} />
      );

      const input = screen.getByPlaceholderText("콘텐츠 검색...");
      fireEvent.change(input, { target: { value: "react" } });

      // Submit via Enter key on the form
      const form = input.closest("form")!;
      fireEvent.submit(form);

      expect(onSearch).toHaveBeenCalledWith("react");
    });
  });
});