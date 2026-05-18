import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatMetadataFilter,
} from './types';
import { fetchApi, API_BASE_URL } from './client';
import { getAuthToken } from '../hooks/useAuth';

export async function createChatCompletion(
  messages: ChatCompletionRequest['messages'],
  options?: {
    temperature?: number;
    user?: string;
    metadataFilter?: ChatMetadataFilter;
    useRag?: boolean;
  }
): Promise<ChatCompletionResponse> {
  return fetchApi('/api/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      messages,
      ...options,
      stream: false,
    } as ChatCompletionRequest),
  });
}

export async function createChatStream(
  messages: ChatCompletionRequest['messages'],
  options?: {
    temperature?: number;
    user?: string;
    metadataFilter?: ChatMetadataFilter;
    useRag?: boolean;
  }
): Promise<ReadableStream<Uint8Array>> {
  const token = getAuthToken();
  const baseUrl = API_BASE_URL || '';

  const response = await fetch(`${baseUrl}/api/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      messages,
      ...options,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Failed to start stream');
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  return response.body;
}