'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMeetings } from '@/lib/api';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMeetings().then(data => { setMeetings(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid #d4c9b8' }}>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 40, letterSpacing: 1 }}>Meeting History</h1>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b' }}>{meetings.length} meetings processed</span>
      </div>

      {loading && (
        <div style={{ height: 3, background: '#d4c9b8', overflow: 'hidden', marginBottom: 24 }}>
          <div className="shimmer" style={{ height: '100%' }} />
        </div>
      )}

      <div style={{ border: '1px solid #d4c9b8', background: '#fff' }}>
        {meetings.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 40px', color: '#8a7d6b' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>📋</div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 24, letterSpacing: 1, marginBottom: 8, color: '#0a0a0a' }}>No meetings yet</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Process your first transcript to see it here</div>
            <Link href="/process" style={{ background: '#0a0a0a', color: '#f5f0e8', padding: '12px 28px', fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: 2, textDecoration: 'none' }}>
              ⚡ Process Transcript
            </Link>
          </div>
        )}
        {meetings.map(m => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: '1px solid #d4c9b8', cursor: 'pointer', transition: 'background 0.15s' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 28, color: '#d4c9b8', width: 40, lineHeight: 1, flexShrink: 0 }}>#{m.id}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
                {m.summary?.slice(0, 140)}...
              </div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b' }}>
                {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
            <Link href={`/meetings/${m.id}`} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, background: '#dbeafe', color: '#1a6bc8', padding: '4px 14px', borderRadius: 3, textDecoration: 'none', flexShrink: 0 }}>
              View →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
