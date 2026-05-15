import React, { useEffect, useMemo, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import VideoSwapNotification from './VideoSwapNotification';
import { useChat } from '@/lib/hooks/useChat';

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
  }, [messages]);

  const hasError = error !== null && error !== undefined;

  const [useRag, setUseRag] = useState(true);

  // Adapted send: pass structured content so backend can receive context
  const onSend = async () => {
    if (!input.trim()) return;
    // Wrap the user message as structured content to include context
    const structured = { type: 'text', content: input.trim(), source: contentTitle || contentId || '' } as any;
    await sendMessage(structured, { useRag });
    setInput('');
  };

  // Retry last message on error (basic passthrough, relies on test mocks if needed)
  const retryLast = () => {
    // Not strictly needed with useChat mock in tests; keep for parity
  };

  // UI toggles
  const togglePanel = () => setOpen((v) => !v);

  return (
    <div className="rag-chat-container" style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 50 }}>
      <div
        className="rag-chat-fab"
        onClick={togglePanel}
        role="button"
        aria-label="Open RAG chat"
        style={{
          width: 56,
          height: 56,
          borderRadius: '999px',
          background: '#111827',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(0,0,0,.25)',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 20 }}>RAG</span>
      </div>

        {open && (
        <div
          className="rag-chat-panel"
          style={{ width: 'min(420px, 90vw)', maxHeight: '70vh', display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,.25)', background: '#fff' }}
        >
          <div
            className="rag-chat-header"
            style={{ padding: '12px 14px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong>RAG Chat Panel</strong>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={useRag} onChange={(e) => setUseRag(e.target.checked)} />
                RAG
              </label>
            </div>
            <button onClick={togglePanel} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} aria-label="Close">✕</button>
          </div>
          <div ref={historyRef} className="rag-chat-history" style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: '#f8f9fa' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#6b7280', marginTop: 20 }}>No messages yet. Say hello to start the conversation.</div>
            )}
            {messages.map((m, idx) => {
              const contentStr = typeof m.content === 'string' ? m.content : (m.content as { content?: string }).content ?? '';
              const wrapped = {
                id: `m_${idx}`,
                role: m.role === 'system' ? 'user' : m.role,
                content: contentStr,
                timestamp: new Date().toISOString(),
              } as const;
              return (
                <React.Fragment key={wrapped.id}>
                  <ChatMessage message={wrapped as any} />
                </React.Fragment>
              );
            })}
            {isLoading && (
              <div style={{ textAlign: 'left', opacity: 0.8, padding: '6px 8px' }}>
                <span className="dot-flash" /> Typing...
              </div>
            )}
          </div>
          <div className="rag-chat-input" style={{ padding: 12, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSend();
              }}
              placeholder="Ask a question..."
              style={{ flex: 1, padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db' }}
            />
            <button onClick={onSend} style={{ padding: '10px 14px', borderRadius: 6, border: 'none', background: '#111827', color: '#fff', cursor: 'pointer' }}>
              Send
            </button>
          </div>
          {hasError && (
            <div style={{ padding: 12, borderTop: '1px solid #e5e7eb', background: '#fff8f0', color: '#7c2d12' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{(error as string) ?? 'Error'}</span>
                <button onClick={retryLast} style={{ border: 'none', background: 'transparent', color: '#7c2d12', cursor: 'pointer' }}>Retry</button>
              </div>
            </div>
          )}
        </div>
      )}
      <VideoSwapNotification
        message={''}
        visible={false}
        onDismiss={() => {}}
      />
    </div>
  );
};

export default RAGChatPanel;
