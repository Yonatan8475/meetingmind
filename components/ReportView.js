'use client';
import { useState } from 'react';

export default function ReportView({ report, tasks, meetingId }) {
  const [mode, setMode] = useState('visual');
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ border: '1px solid #d4c9b8', background: '#fff', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', background: '#ede7d9', borderBottom: '1px solid #d4c9b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
          📊 Agent 3 — Follow-Up Report
          {meetingId && <span style={{ marginLeft: 12, background: '#0a0a0a', color: '#f5f0e8', padding: '2px 8px', fontSize: 10 }}>Meeting #{meetingId}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['visual', 'raw'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, padding: '3px 10px',
              border: '1px solid #d4c9b8', cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase',
              background: mode === m ? '#0a0a0a' : 'transparent',
              color: mode === m ? '#f5f0e8' : '#8a7d6b',
            }}>{m}</button>
          ))}
          <button onClick={copy} style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10, padding: '3px 10px',
            border: '1px solid #d4c9b8', cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase',
            background: copied ? '#1a7a4a' : 'transparent',
            color: copied ? 'white' : '#8a7d6b',
          }}>{copied ? '✓ Copied' : 'Copy'}</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>
        {mode === 'visual' ? (
          <div>
            {tasks?.map((t, i) => (
              <div key={i} className="fade-up" style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid #d4c9b8', animationDelay: `${i * 0.08}s` }}>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 24, color: '#c8401a', lineHeight: 1 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{t.task}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, padding: '3px 10px', borderRadius: 3, background: '#ede9fe', color: '#6d28d9' }}>👤 {t.owner || 'Unknown'}</span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, padding: '3px 10px', borderRadius: 3, background: '#fef3c7', color: '#92400e' }}>📅 Due: {t.deadline || 'No deadline'}</span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, padding: '3px 10px', borderRadius: 3, background: '#dcfce7', color: '#1a7a4a' }}>● Pending</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <pre style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, lineHeight: 2, background: '#f5f0e8', padding: 20, whiteSpace: 'pre-wrap' }}>
            {report}
          </pre>
        )}
      </div>
    </div>
  );
}
