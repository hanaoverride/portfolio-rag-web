"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structured?: boolean;
  data?: Record<string, unknown>;
};

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div
      className={`rag-chat-message ${isUser ? 'rag-user' : 'rag-assistant'}`}
      style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}
    >
      <div
        className="bubble"
        style={{
          maxWidth: '80%',
          padding: '10px 12px',
          borderRadius: 12,
          background: isUser ? '#3b82f6' : '#f3f4f6',
          color: isUser ? '#fff' : '#111827',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div className="markdown-content" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6, textAlign: 'right' }}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

