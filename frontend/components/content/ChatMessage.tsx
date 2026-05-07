import React from 'react';

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
          background: isUser ? '#3b82f6' : '#e5e7eb',
          color: isUser ? '#fff' : '#111827',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6, textAlign: 'right' }}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
