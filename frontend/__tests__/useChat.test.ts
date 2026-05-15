import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ChatCompletionResponse } from '@/lib/api/types';

const mockCreateChatStream = vi.fn();

vi.mock('@/lib/api/chat', () => ({
  createChatStream: mockCreateChatStream,
}));

vi.mock('@/lib/hooks/useAuth', () => ({
  getAuthToken: vi.fn(() => 'mock-token'),
}));

// Helper to mock ReadableStream for vitest/jsdom
const createMockStream = (text: string) => {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
};

const mockResponse: ChatCompletionResponse = {
  id: 'test-id',
  object: 'chat.completion',
  created: Date.now(),
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: { type: 'text', content: 'mock reply' },
      },
      finishReason: 'stop',
    },
  ],
};

describe('useChat', () => {
  let useChat: typeof import('@/lib/hooks/useChat').useChat;

  beforeAll(() => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false';
  });

  beforeAll(async () => {
    const mod = await import('@/lib/hooks/useChat');
    useChat = mod.useChat;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rapid send includes both messages', async () => {
    mockCreateChatStream.mockImplementation(() => Promise.resolve(createMockStream('mock reply')));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      const p1 = result.current.sendMessage('first');
      const p2 = result.current.sendMessage('second');
      await Promise.all([p1, p2]);
    });

    const userMessages = result.current.messages.filter((m) => m.role === 'user');
    expect(userMessages).toHaveLength(2);
    expect(userMessages[0].content).toBe('first');
    expect(userMessages[1].content).toBe('second');

    expect(mockCreateChatStream).toHaveBeenCalledTimes(2);

    const secondCallMessages = mockCreateChatStream.mock.calls[1][0];
    expect(secondCallMessages).toHaveLength(3); // [user1, assistant1, user2]
  });

  it('error rollback removes failed message', async () => {
    mockCreateChatStream.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('will-fail');
    });

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.error).toBe('API Error');
  });

  it('clearMessages empties everything', async () => {
    mockCreateChatStream.mockImplementation(() => Promise.resolve(createMockStream('mock reply')));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('test message');
    });

    expect(result.current.messages.length).toBeGreaterThan(0);

    await act(async () => {
      result.current.clearMessages();
    });

    expect(result.current.messages).toHaveLength(0);
  });
});
