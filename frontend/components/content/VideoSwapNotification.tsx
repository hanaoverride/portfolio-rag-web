import React from 'react';

type Props = {
  message: string;
  visible: boolean;
  onDismiss: () => void;
};

const VideoSwapNotification: React.FC<Props> = ({ message, visible, onDismiss }) => {
  if (!visible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ position: 'fixed', bottom: 90, right: 16, background: '#111827', color: '#fff', padding: '12px 14px', borderRadius: 8, boxShadow: '0 6px 14px rgba(0,0,0,.25)', zIndex: 60 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Video</span>
        <span style={{ fontWeight: 600 }}>{message}</span>
        <button onClick={onDismiss} style={{ marginLeft: 8, border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Dismiss</button>
      </div>
    </div>
  );
};

export default VideoSwapNotification;
