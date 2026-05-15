"use client";

import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import VideoSwapNotification from './VideoSwapNotification';
import { useChat, StructuredChatContent } from '@/lib/hooks/useChat';

interface RAGChatPanelProps {
  contentId?: string;
  contentTitle?: string;
}

const RAGChatPanel: React.FC<RAGChatPanelProps> = ({ contentId = '', contentTitle = '' }) => {
  // Use centralized chat logic
  const { messages, isLoading, error, sendMessage } = useChat();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const historyRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const hasError = error !== null && error !== undefined;
  
  const onSend = async () => {
    if (!input.trim() || isLoading) return;
    const currentInput = input.trim();
    setInput('');
    // Wrap the user message as structured content to include context
    const structured: StructuredChatContent = { type: 'text', content: currentInput, source: contentTitle || contentId || '' };
    await sendMessage(structured, { useRag: true });
  };

  // UI toggles
  const togglePanel = () => setOpen((v) => !v);

  return (
    <div className="rag-chat-container" style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 100 }}>
      <button
        className="rag-chat-fab"
        onClick={togglePanel}
        aria-label="Open RAG chat"
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#111827',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <MessageCircle size={28} />
      </button>

      {open && (
        <div
          className="rag-chat-panel"
          style={{ 
            position: 'absolute',
            bottom: 80,
            right: 0,
            width: 'min(420px, 90vw)', 
            height: '600px',
            maxHeight: 'calc(100vh - 120px)',
            display: 'flex', 
            flexDirection: 'column', 
            borderRadius: 16, 
            overflow: 'hidden', 
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)', 
            background: '#fff',
            border: '1px solid #f3f4f6'
          }}
        >
          <div
            className="rag-chat-header"
            style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #f3f4f6', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: '#fff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div>
              <strong style={{ fontSize: '1.1rem', color: '#111827' }}>AI Assistant</strong>
            </div>
            <button onClick={togglePanel} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }} aria-label="Close">
              <X size={20} />
            </button>
          </div>
          
          <div ref={historyRef} className="rag-chat-history" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, background: '#fff' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: 40, padding: '0 20px' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#4b5563', marginBottom: 8 }}>Welcome!</p>
                <p style={{ fontSize: '0.9rem' }}>Ask me anything about {contentTitle || 'this content'}.</p>
              </div>
            )}
            {messages.map((m, idx) => {
              const contentStr = typeof m.content === 'string' ? m.content : (m.content as { content?: string }).content ?? '';
              // Simple role check
              const role = m.role === 'assistant' ? 'assistant' : 'user';
              const wrapped = {
                id: `m_${idx}`,
                role: role as 'user' | 'assistant',
                content: contentStr,
                timestamp: new Date().toISOString(),
              } as const;
              
              // Don't show empty assistant messages unless loading
              if (role === 'assistant' && !contentStr && idx === messages.length - 1 && isLoading) return null;

              return (
                <ChatMessage key={wrapped.id} message={wrapped} />
              );
            })}
            {isLoading && !messages[messages.length - 1]?.content && (
              <div style={{ display: 'flex', gap: 4, padding: '8px 12px', background: '#f3f4f6', borderRadius: 12, alignSelf: 'flex-start', maxWidth: '80%' }}>
                <span className="dot-flash" style={{ width: 6, height: 6, background: '#9ca3af', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span>
                <span className="dot-flash" style={{ width: 6, height: 6, background: '#9ca3af', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.2s' }}></span>
                <span className="dot-flash" style={{ width: 6, height: 6, background: '#9ca3af', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.4s' }}></span>
              </div>
            )}
            {hasError && (
              <div style={{ padding: '12px 16px', borderRadius: 12, background: '#fef2f2', color: '#991b1b', fontSize: '0.9rem', border: '1px solid #fee2e2' }}>
                <p style={{ fontWeight: '600', marginBottom: 4 }}>Error sending message</p>
                <p>{(error as string) ?? 'Something went wrong. Please try again.'}</p>
              </div>
            )}
          </div>

          <div className="rag-chat-input-container" style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#f9fafb', borderRadius: 12, padding: '4px 4px 4px 16px', border: '1px solid #e5e7eb' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                disabled={isLoading}
                placeholder={isLoading ? "AI is thinking..." : "Ask a question..."}
                style={{ 
                  flex: 1, 
                  padding: '10px 0', 
                  borderRadius: 8, 
                  border: 'none', 
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.95rem',
                  color: '#111827'
                }}
              />
              <button 
                onClick={onSend} 
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                style={{ 
                  width: 40,
                  height: 40,
                  borderRadius: 10, 
                  border: 'none', 
                  background: isLoading || !input.trim() ? '#e5e7eb' : '#111827', 
                  color: '#fff', 
                  cursor: isLoading || !input.trim() ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease'
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      <VideoSwapNotification
        message={''}
        visible={false}
        onDismiss={() => {}}
      />
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default RAGChatPanel;

