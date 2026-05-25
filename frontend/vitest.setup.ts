import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Mock localStorage for the test environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    length: 0,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});


const matchMediaListeners = new Map<string, Set<(e: MediaQueryListEvent) => void>>();

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((_: string, handler: (e: MediaQueryListEvent) => void) => {
      if (!matchMediaListeners.has(query)) {
        matchMediaListeners.set(query, new Set());
      }
      matchMediaListeners.get(query)!.add(handler);
    }),
    removeEventListener: vi.fn((_: string, handler: (e: MediaQueryListEvent) => void) => {
      matchMediaListeners.get(query)?.delete(handler);
    }),
    dispatchEvent: vi.fn(),
  })),
});

export { matchMediaListeners };

afterEach(() => {
  matchMediaListeners.clear();
  cleanup();
});