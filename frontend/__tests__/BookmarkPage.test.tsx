import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockFetchBookmarks = vi.fn();
const mockRemoveBookmark = vi.fn();

vi.mock('@/lib/hooks', () => ({
  useBookmarks: () => ({
    bookmarks: [],
    total: 0,
    isLoading: false,
    error: null,
    fetchBookmarks: mockFetchBookmarks,
    addBookmark: vi.fn(),
    removeBookmark: mockRemoveBookmark,
    clearError: vi.fn(),
  }),
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { id: 1, email: 'test@test.com', displayName: 'Test' },
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({ get: () => null }),
}));

import BookmarkPage from '@/app/bookmark/page';

describe('BookmarkPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<BookmarkPage />);
  });

  it('displays bookmark header', async () => {
    render(<BookmarkPage />);
    await waitFor(() => {
      expect(screen.getByText('북마크')).toBeInTheDocument();
    });
  });
});
