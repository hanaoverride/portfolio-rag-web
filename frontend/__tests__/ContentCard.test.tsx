import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContentCard } from "@/components/common/ContentCard";
import type { Content } from "@/lib/api/types";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  } & Record<string, unknown>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    ...props
  }: {
    alt: string;
    src: string;
  } & Record<string, unknown>) => <img alt={alt} src={src} {...props} />,
}));

vi.mock("lucide-react", () => ({
  Bookmark: () => <svg data-testid="bookmark-icon" />,
  BookmarkCheck: () => <svg data-testid="bookmark-check-icon" />,
  Clock: () => <svg data-testid="clock-icon" />,
  Eye: () => <svg data-testid="eye-icon" />,
}));

const mockContent: Content = {
  id: "1",
  title: "Test Content",
  description: "A test description",
  thumbnail: "/test-thumbnail.jpg",
  videoUrl: "https://example.com/video",
  category: ["Tech", "Programming"],
  author: { name: "Test Author", avatar: "/test-avatar.jpg" },
  duration: 120,
  views: 500,
  createdAt: "2024-01-01T00:00:00Z",
  tableOfContents: [],
  bodyContent: "",
  relatedContents: [],
};

describe("ContentCard", () => {
  describe("bookmark button visibility based on isAuthenticated", () => {
    it("does NOT render bookmark button when isAuthenticated is false", () => {
      render(<ContentCard content={mockContent} isAuthenticated={false} />);

      expect(
        screen.queryByRole("button", { name: /북마크/ })
      ).not.toBeInTheDocument();
    });

    it("renders bookmark button when isAuthenticated is true", () => {
      render(<ContentCard content={mockContent} isAuthenticated={true} />);

      expect(
        screen.getByRole("button", { name: /북마크/ })
      ).toBeInTheDocument();
    });

    it("renders bookmark button when isAuthenticated is undefined (backward compat)", () => {
      render(<ContentCard content={mockContent} />);

      expect(
        screen.getByRole("button", { name: /북마크/ })
      ).toBeInTheDocument();
    });
  });
});
