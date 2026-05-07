import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("renders 404 heading", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(<NotFound />);
    expect(screen.getByText("페이지를 찾을 수 없습니다")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<NotFound />);
    expect(
      screen.getByText("요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.")
    ).toBeInTheDocument();
  });

  it("renders home link", () => {
    render(<NotFound />);
    const homeLink = screen.getByText("홈으로 돌아가기");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders Layer logo link", () => {
    render(<NotFound />);
    const logoLink = screen.getByText("Layer");
    expect(logoLink).toBeInTheDocument();
    expect(logoLink.closest("a")).toHaveAttribute("href", "/");
  });
});