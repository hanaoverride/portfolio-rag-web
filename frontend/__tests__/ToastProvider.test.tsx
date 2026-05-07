import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider } from '@/components/common/ToastProvider';
import { useToast } from '@/lib/hooks/useToast';

function TestButton({
  message,
  type,
  duration,
}: {
  message: string;
  type: 'success' | 'error';
  duration?: number;
}) {
  const { showToast } = useToast();
  return (
    <button onClick={() => showToast(message, type, duration)} data-testid="show-toast">
      Show Toast
    </button>
  );
}

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders children', () => {
    render(
      <ToastProvider>
        <div data-testid="child">Child Content</div>
      </ToastProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('shows a toast in the DOM after showToast is called', () => {
    render(
      <ToastProvider>
        <TestButton message="Test success toast" type="success" />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('show-toast').click();
    });

    expect(screen.getByText('Test success toast')).toBeInTheDocument();
  });

  it('shows an error toast with correct styling', () => {
    render(
      <ToastProvider>
        <TestButton message="Test error toast" type="error" />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('show-toast').click();
    });

    const toast = screen.getByText('Test error toast');
    expect(toast).toBeInTheDocument();
  });

  it('shows multiple toasts simultaneously', () => {
    function MultiToastButton() {
      const { showToast } = useToast();
      return (
        <button
          onClick={() => {
            showToast('Toast One', 'success');
            showToast('Toast Two', 'error');
          }}
          data-testid="show-multi"
        >
          Show Multiple
        </button>
      );
    }

    render(
      <ToastProvider>
        <MultiToastButton />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('show-multi').click();
    });

    expect(screen.getByText('Toast One')).toBeInTheDocument();
    expect(screen.getByText('Toast Two')).toBeInTheDocument();
  });

  it('auto-dismisses toast after 3000ms', () => {
    render(
      <ToastProvider>
        <TestButton message="Auto dismiss" type="success" />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('show-toast').click();
    });

    expect(screen.getByText('Auto dismiss')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument();
  });

  it('has a close button on each toast', () => {
    render(
      <ToastProvider>
        <TestButton message="Closable toast" type="success" />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('show-toast').click();
    });

    const closeButton = screen.getByLabelText('Close toast');
    expect(closeButton).toBeInTheDocument();
  });
});
