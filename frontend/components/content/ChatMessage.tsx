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
          maxWidth: isUser ? '80%' : '100%',
          width: isUser ? 'auto' : '100%',
          padding: '12px 16px',
          borderRadius: 12,
          background: isUser ? '#3b82f6' : '#f3f4f6',
          color: isUser ? '#fff' : '#111827',
          border: '1px solid rgba(0,0,0,0.05)',
          overflowX: 'hidden'
        }}
      >
        <div className={`markdown-content ${isUser ? 'user-content' : 'ai-content'}`} style={{ fontSize: '0.95rem', lineHeight: '1.6', wordBreak: 'break-word' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 8, textAlign: 'right' }}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      <style>{`
        .markdown-content.ai-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
          display: block;
          overflow-x: auto;
          white-space: nowrap;
        }
        .markdown-content.ai-content th, .markdown-content.ai-content td {
          border: 1px solid #d1d5db;
          padding: 8px 12px;
          text-align: left;
        }
        .markdown-content.ai-content th {
          background-color: #e5e7eb;
          font-weight: 600;
        }
        .markdown-content p {
          margin-bottom: 0.75em;
        }
        .markdown-content p:last-child {
          margin-bottom: 0;
        }
        .markdown-content pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 12px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
        }
        .markdown-content code {
          background: rgba(0,0,0,0.1);
          padding: 2px 4px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9em;
        }
        .markdown-content.user-content code {
          background: rgba(255,255,255,0.2);
        }
        .markdown-content pre code {
          background: transparent;
          padding: 0;
          color: inherit;
        }
        .markdown-content ul, .markdown-content ol {
          padding-left: 1.5em;
          margin-bottom: 0.75em;
        }
        .markdown-content li {
          margin-bottom: 0.25em;
        }
      `}</style>
    </div>
  );
};

export default ChatMessage;

