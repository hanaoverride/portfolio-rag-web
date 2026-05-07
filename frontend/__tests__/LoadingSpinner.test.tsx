import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders without crashing", () => {
    render(<LoadingSpinner />);
    expect(screen.getByLabelText("로딩 중")).toBeInTheDocument();
  });

  it("renders with sm size", () => {
    render(<LoadingSpinner size="sm" />);
    const spinner = screen.getByLabelText("로딩 중");
    expect(spinner).toBeInTheDocument();
  });

  it("renders with lg size", () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByLabelText("로딩 중");
    expect(spinner).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("has correct default size class", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByLabelText("로딩 중");
    expect(spinner).toHaveClass("h-8", "w-8");
  });

  it("has sm size class", () => {
    render(<LoadingSpinner size="sm" />);
    const spinner = screen.getByLabelText("로딩 중");
    expect(spinner).toHaveClass("h-4", "w-4");
  });

  it("has lg size class", () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByLabelText("로딩 중");
    expect(spinner).toHaveClass("h-12", "w-12");
  });
});