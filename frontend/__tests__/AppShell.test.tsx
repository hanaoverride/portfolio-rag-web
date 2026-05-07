import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockGetCategories = vi.hoisted(() => vi.fn().mockResolvedValue([
  { id: '1', slug: 'tech', name: 'Technology' },
  { id: '2', slug: 'science', name: 'Science' },
]));

vi.mock('@/lib/api/categories', () => ({
  getCategories: mockGetCategories,
}));

let capturedOnCategorySelect: Function | null = null;
let capturedOnSearch: Function | null = null;
let capturedCategories: unknown[] | null = null;
vi.mock('@/components/layout/Header', () => ({
  Header: vi.fn((props: any) => {
    capturedOnCategorySelect = props.onCategorySelect;
    capturedOnSearch = props.onSearch;
    capturedCategories = props.categories;
    return <header data-testid="header">Header</header>;
  }),
}));

vi.mock('@/components/layout/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

import AppShell from '@/components/layout/AppShell';

describe('AppShell', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockGetCategories.mockClear();
    capturedOnCategorySelect = null;
    capturedOnSearch = null;
    capturedCategories = null;
  });

  it('renders Header and Footer', () => {
    const { getByTestId } = render(<AppShell><p>child</p></AppShell>);
    expect(getByTestId('header')).toBeInTheDocument();
    expect(getByTestId('footer')).toBeInTheDocument();
  });

  it('renders children in main', () => {
    const { getByText } = render(<AppShell><p>child content</p></AppShell>);
    expect(getByText('child content')).toBeInTheDocument();
  });

  it('passes onCategorySelect to Header that navigates to category page', () => {
    render(<AppShell><p>x</p></AppShell>);
    expect(capturedOnCategorySelect).toBeDefined();
    expect(typeof capturedOnCategorySelect).toBe('function');
    
    capturedOnCategorySelect!({ slug: 'it-programming', name: 'IT', id: '1' });
    expect(mockPush).toHaveBeenCalledWith('/category/it-programming');
  });

  it('fetches categories and passes them to Header', async () => {
    render(<AppShell><p>x</p></AppShell>);

    expect(mockGetCategories).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(capturedCategories).toEqual([
        { id: '1', slug: 'tech', name: 'Technology' },
        { id: '2', slug: 'science', name: 'Science' },
      ]);
    });
  });

  it('onSearch navigates to /search?q=...', () => {
    render(<AppShell><p>x</p></AppShell>);
    expect(capturedOnSearch).toBeDefined();
    expect(typeof capturedOnSearch).toBe('function');

    capturedOnSearch!('test query');
    expect(mockPush).toHaveBeenCalledWith('/search?q=test%20query');
  });

  it('renders exactly one header element after mount', async () => {
    const { container } = render(<AppShell><p>test child</p></AppShell>);
    await waitFor(() => {
      expect(container.querySelectorAll('header').length).toBe(1);
    });
  });

  it('renders exactly one footer element after mount', async () => {
    const { container } = render(<AppShell><p>test child</p></AppShell>);
    await waitFor(() => {
      expect(container.querySelectorAll('footer').length).toBe(1);
    });
  });

  it('renders children inside main element', async () => {
    const { container } = render(<AppShell><p>test child</p></AppShell>);
    await waitFor(() => {
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveTextContent('test child');
    });
  });
});
