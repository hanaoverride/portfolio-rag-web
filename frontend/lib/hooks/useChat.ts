"use client";

import { useState, useCallback, useRef } from 'react';
import type { ChatMessagePayload } from '../api/types';
import { createChatStream } from '../api/chat';
import { getAuthToken } from './useAuth';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

interface UseChatReturn {
  messages: ChatMessagePayload[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string | StructuredChatContent, options?: { useRag?: boolean }) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

export interface StructuredChatContent {
  type: string;
  content: string;
  source?: string;
}

const DEMO_RESPONSES = [
  "I'm here to help you discover great content! What topics interest you?",
  "Based on your preferences, I think you'd enjoy content about productivity and learning strategies.",
  "I can help you find specific content or recommend new creators to follow.",
];

function getDemoResponse(): string {
  const index = Math.floor(Math.random() * DEMO_RESPONSES.length);
  return DEMO_RESPONSES[index];
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<ChatMessagePayload[]>([]);

  const clearError = useCallback(() => setError(null), []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    messagesRef.current = [];
  }, []);

  const sendMessage = useCallback(async (content: string | StructuredChatContent, options?: { useRag?: boolean }) => {
    const userMessage: ChatMessagePayload = {
      role: 'user',
      content,
    };

    messagesRef.current = [...messagesRef.current, userMessage];
    setMessages(messagesRef.current);
    setIsLoading(true);
    setError(null);

    // Prepare assistant message placeholder
    const assistantMessage: ChatMessagePayload = {
      role: 'assistant',
      content: '',
    };
    
    // Add assistant placeholder to state
    messagesRef.current = [...messagesRef.current, assistantMessage];
    setMessages(messagesRef.current);

    try {
      if (DEMO_MODE) {
        const fullText = getDemoResponse();
        const words = fullText.split(' ');
        let currentText = '';
        
        for (const word of words) {
          await new Promise(resolve => setTimeout(resolve, 50));
          currentText += (currentText ? ' ' : '') + word;
          
          // Update assistant message content
          const updatedAssistant = { ...assistantMessage, content: currentText };
          messagesRef.current = [...messagesRef.current.slice(0, -1), updatedAssistant];
          setMessages([...messagesRef.current]);
        }
      } else {
        const token = getAuthToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        const history = messagesRef.current.slice(0, -1).map(m => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        }));

        const stream = await createChatStream(history, { useRag: options?.useRag });
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let currentText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          currentText += chunk;

          // Update assistant message content
          const updatedAssistant = { ...assistantMessage, content: currentText };
          messagesRef.current = [...messagesRef.current.slice(0, -1), updatedAssistant];
          setMessages([...messagesRef.current]);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      setError(message);
      // Remove both user and placeholder assistant message on error
      messagesRef.current = messagesRef.current.slice(0, -2);
      setMessages([...messagesRef.current]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    clearError,
  };
}

export { DEMO_MODE };

