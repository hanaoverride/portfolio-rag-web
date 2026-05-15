import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Dynamic mock: use mockUseChat.mockReturnValue(...) per test
const mockUseChat = vi.fn();

vi.mock('@/lib/hooks/useChat', () => ({
  useChat: () => mockUseChat(),
}));

import RAGChatPanel from '@/components/content/RAGChatPanel';

describe('RAGChatPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: empty messages
    mockUseChat.mockReturnValue({
      messages: [],
      isLoading: false,
      error: null,
      sendMessage: vi.fn().mockResolvedValue(undefined),
      clearMessages: vi.fn(),
      clearError: vi.fn(),
    });
  });

  it('renders messages and sends user input via useChat.sendMessage with context', async () => {
    mockUseChat.mockReturnValue({
      messages: [
        { role: 'user', content: 'Hi' },
        { role: 'assistant', content: 'Hello' },
      ],
      isLoading: false,
      error: null,
      sendMessage: vi.fn().mockResolvedValue(undefined),
      clearMessages: vi.fn(),
      clearError: vi.fn(),
    });

    // Render the component with content context
    render(<RAGChatPanel contentId="content-123" contentTitle="Demo Content" />);

    // Open the chat panel by clicking the FAB
    const fab = screen.getByLabelText('Open RAG chat');
    fireEvent.click(fab);

    // The input placeholder should be visible
    const input = await screen.findByPlaceholderText('Ask a question...');
    expect(input).toBeInTheDocument();

    // Type a message and send
    fireEvent.change(input, { target: { value: 'Test message' } });
    const sendBtn = screen.getByLabelText('Send message');
    fireEvent.click(sendBtn);

    // Ensure the input is cleared after sending
    await waitFor(() => expect((input as HTMLInputElement).value).toBe(''));
  });

  it('renders structured content as text, not JSON', () => {
    mockUseChat.mockReturnValue({
      messages: [
        { role: 'user', content: { type: 'text', content: 'Hello World', source: 'demo' } },
      ],
      isLoading: false,
      error: null,
      sendMessage: vi.fn().mockResolvedValue(undefined),
      clearMessages: vi.fn(),
      clearError: vi.fn(),
    });

    render(<RAGChatPanel contentId="content-123" />);
    const fab = screen.getByLabelText('Open RAG chat');
    fireEvent.click(fab);

    // The inner '.content' field should be extracted and displayed as text
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    // Raw JSON should NOT appear
    expect(screen.queryByText(/\{"type":"text","content":"Hello World","source":"demo"\}/)).not.toBeInTheDocument();
  });

  it('renders plain string content as-is', () => {
    mockUseChat.mockReturnValue({
      messages: [
        { role: 'assistant', content: 'plain text' },
      ],
      isLoading: false,
      error: null,
      sendMessage: vi.fn().mockResolvedValue(undefined),
      clearMessages: vi.fn(),
      clearError: vi.fn(),
    });

    render(<RAGChatPanel />);
    const fab = screen.getByLabelText('Open RAG chat');
    fireEvent.click(fab);

    expect(screen.getByText('plain text')).toBeInTheDocument();
  });

  it('handles missing content field gracefully', () => {
    mockUseChat.mockReturnValue({
      messages: [
        { role: 'user', content: { type: 'text' } as any },
      ],
      isLoading: false,
      error: null,
      sendMessage: vi.fn().mockResolvedValue(undefined),
      clearMessages: vi.fn(),
      clearError: vi.fn(),
    });

    render(<RAGChatPanel />);
    const fab = screen.getByLabelText('Open RAG chat');
    fireEvent.click(fab);

    // Should not crash and should NOT render raw JSON
    expect(screen.queryByText(/{"type":"text"}/)).not.toBeInTheDocument();
  });
});
