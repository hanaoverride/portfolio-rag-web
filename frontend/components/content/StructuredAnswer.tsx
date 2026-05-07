import React from 'react';

type Section = { title: string; bullets: string[] };
type Data = {
  overview?: string;
  sections?: Section[];
  citations?: string[];
  timestampLinks?: { label: string; time: string }[];
};

const StructuredAnswer: React.FC<{ data: Data; onJump?: (time: string) => void }> = ({ data, onJump }) => {
  return (
    <div className="rag-structured" style={{ padding: '6px 12px 12px 12px', borderLeft: '2px solid #d1d5db', marginTop: 6, background: '#ffffff' }}>
      {data.overview && (
        <div style={{ marginBottom: 8 }}>
          <strong>Overview</strong>
          <div style={{ fontSize: 14, color: '#374151' }}>{data.overview}</div>
        </div>
      )}
      {data.sections?.length && data.sections.map((s, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 600 }}>{s.title}</div>
          <ul style={{ marginTop: 6, paddingLeft: 20 }}>
            {s.bullets.map((b, i) => (
              <li key={i} style={{ fontSize: 14 }}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
      {data.citations?.length ? (
        <div style={{ marginTop: 6 }}>
          <strong>Citations</strong>
          <ul style={{ marginTop: 4, paddingLeft: 20 }}>
            {data.citations!.map((c, i) => (
              <li key={i} style={{ fontSize: 13, color: '#374151' }}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {data.timestampLinks?.length ? (
        <div style={{ marginTop: 6 }}>
          {data.timestampLinks.map((t, i) => (
            <button key={i} onClick={() => onJump?.(t.time)} style={{ marginRight: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer', background: '#f8fafc' }}>
              {t.label} ({t.time})
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default StructuredAnswer;
