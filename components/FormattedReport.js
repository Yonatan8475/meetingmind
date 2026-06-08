'use client';
import { useState } from 'react';
import { getDownloadUrl } from '@/lib/api';

export default function FormattedReport({ reportText, meetingId, tasks, summary, report }) {
  const [view, setView] = useState('formatted');
  const [copied, setCopied] = useState(false);

  const downloadUrl = meetingId ? getDownloadUrl(meetingId) : null;

  const copyToClipboard = () => {
    const text = reportText || report || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ border: '1px solid #d4c9b8', background: '#fff', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        padding: '14px 20px',
        background: '#ede7d9',
        borderBottom: '1px solid #d4c9b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
      }}>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
          📄 Meeting Report
          {meetingId && (
            <span style={{ marginLeft: 12, background: '#0a0a0a', color: '#f5f0e8', padding: '2px 8px', fontSize: 10, letterSpacing: 1 }}>
              #{meetingId}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* View toggles */}
          {['formatted', 'raw'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, padding: '3px 10px',
              border: '1px solid #d4c9b8', cursor: 'pointer', letterSpacing: 1,
              textTransform: 'uppercase',
              background: view === v ? '#0a0a0a' : 'transparent',
              color: view === v ? '#f5f0e8' : '#8a7d6b',
            }}>
              {v}
            </button>
          ))}

          {/* Copy button */}
          <button onClick={copyToClipboard} style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10, padding: '3px 10px',
            border: '1px solid #d4c9b8', cursor: 'pointer', letterSpacing: 1,
            textTransform: 'uppercase',
            background: copied ? '#1a7a4a' : 'transparent',
            color: copied ? 'white' : '#8a7d6b',
          }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>

          {/* Download button */}
          {downloadUrl && (
            <a href={downloadUrl} download={`meeting_${meetingId}_report.txt`} style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, padding: '3px 10px',
              border: '1px solid #0a0a0a', textDecoration: 'none', letterSpacing: 1,
              textTransform: 'uppercase', background: '#0a0a0a', color: '#f5f0e8',
              display: 'inline-block',
            }}>
              ⬇ Download .txt
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 24 }}>
        {view === 'formatted' ? (
          <div>

            {/* Summary Section */}
            {summary && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: 1 }}>SUMMARY</div>
                  <div style={{ flex: 1, height: 1, background: '#d4c9b8' }} />
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.8, color: '#3a3028', whiteSpace: 'pre-line' }}>
                  {summary}
                </div>
              </div>
            )}

            {/* Action Items Section */}
            {tasks && tasks.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: 1 }}>ACTION ITEMS</div>
                  <div style={{ flex: 1, height: 1, background: '#d4c9b8' }} />
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, background: '#dcfce7', color: '#1a7a4a', padding: '2px 8px', borderRadius: 3 }}>
                    {tasks.length} tasks
                  </span>
                </div>
                {tasks.map((t, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid #d4c9b8' }}>
                    <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 22, color: '#c8401a', lineHeight: 1 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{t.task}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <div style={{ background: '#f5f0e8', border: '1px solid #d4c9b8', padding: '4px 12px' }}>
                          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: '#8a7d6b', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Owner</div>
                          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: '#6d28d9' }}>👤 {t.owner || 'Unknown'}</div>
                        </div>
                        <div style={{ background: '#f5f0e8', border: '1px solid #d4c9b8', padding: '4px 12px' }}>
                          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: '#8a7d6b', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Deadline</div>
                          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: '#92400e' }}>📅 {t.deadline || 'No deadline'}</div>
                        </div>
                        <div style={{ background: '#dcfce7', border: '1px solid #86efac', padding: '4px 12px' }}>
                          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: '#8a7d6b', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Status</div>
                          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: '#1a7a4a' }}>● Pending</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Follow-up Report Section */}
            {report && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: 1 }}>FOLLOW-UP REPORT</div>
                  <div style={{ flex: 1, height: 1, background: '#d4c9b8' }} />
                </div>
                <pre style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, lineHeight: 2, background: '#f5f0e8', padding: 16, whiteSpace: 'pre-wrap', color: '#0a0a0a' }}>
                  {report}
                </pre>
              </div>
            )}

          </div>
        ) : (
          <pre style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 12, lineHeight: 1.8,
            background: '#f5f0e8', padding: 20, whiteSpace: 'pre-wrap',
            color: '#0a0a0a', border: '1px solid #d4c9b8',
            maxHeight: 600, overflowY: 'auto',
          }}>
            {reportText || report || 'No report available'}
          </pre>
        )}
      </div>

    </div>
  );
}



