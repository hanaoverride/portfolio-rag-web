import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { matchMediaListeners } from "../vitest.setup";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    matchMediaListeners.clear();
  });

  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  it("renders without crashing", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows system icon by default when no stored theme", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", expect.stringContaining("시스템"));
  });

  it("cycles theme on click: system → light → dark → system", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("aria-label", expect.stringContaining("시스템"));

    fireEvent.click(button);
    expect(localStorage.getItem("theme")).toBe("light");
    expect(button).toHaveAttribute("aria-label", expect.stringContaining("라이트"));

    fireEvent.click(button);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(button).toHaveAttribute("aria-label", expect.stringContaining("다크"));

    fireEvent.click(button);
    expect(localStorage.getItem("theme")).toBe("system");
    expect(button).toHaveAttribute("aria-label", expect.stringContaining("시스템"));
  });

  it("adds dark class to html element when theme is dark", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    fireEvent.click(button);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class from html element when theme is light", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("reads stored theme from localStorage on mount", () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeToggle />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", expect.stringContaining("다크"));
  });

  it("applies dark class on mount when stored theme is dark", () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeToggle />);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("does not apply dark class on mount when stored theme is light", () => {
    localStorage.setItem("theme", "light");
    render(<ThemeToggle />);

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("responds to system preference changes when theme is system", async () => {
    render(<ThemeToggle />);

    expect(document.documentElement.classList.contains("dark")).toBe(false);

    await waitFor(() => {
      const listeners = matchMediaListeners.get("(prefers-color-scheme: dark)");
      expect(listeners).toBeDefined();
      expect(listeners!.size).toBeGreaterThan(0);
    });

    const listeners = matchMediaListeners.get("(prefers-color-scheme: dark)")!;
    Array.from(listeners).forEach((handler) => {
      handler({ matches: true } as MediaQueryListEvent);
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});