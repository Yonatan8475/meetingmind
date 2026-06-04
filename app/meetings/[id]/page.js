'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMeeting } from '@/lib/api';
import TaskItem from '@/components/TaskItem';
import ReportView from '@/components/ReportView';

export default function MeetingDetail({ params }) {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMeeting(params.id).then(data => { setMeeting(data); setLoading(false); }).catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div style={{ height: 3, background: '#d4c9b8', overflow: 'hidden' }}>
      <div className="shimmer" style={{ height: '100%' }} />
    </div>
  );

  if (!meeting) return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#8a7d6b' }}>
      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 32, color: '#0a0a0a', marginBottom: 12 }}>Meeting Not Found</div>
      <Link href="/meetings" style={{ color: '#1a6bc8' }}>← Back to Meetings</Link>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid #d4c9b8' }}>
        <Link href="/meetings" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b', textDecoration: 'none', letterSpacing: 1 }}>← Back</Link>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 36, letterSpacing: 1 }}>Meeting #{meeting.id}</h1>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b' }}>{new Date(meeting.created_at).toLocaleString()}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Summary */}
        <div style={{ border: '1px solid #d4c9b8', background: '#fff' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #d4c9b8', background: '#ede7d9', fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>📝 Summary</div>
          <div style={{ padding: 20, fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-line', color: '#3a3028' }}>{meeting.summary}</div>
        </div>

        {/* Tasks */}
        <div style={{ border: '1px solid #d4c9b8', background: '#fff' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #d4c9b8', background: '#ede7d9', fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
            <span>✅ Action Items</span>
            <span style={{ background: '#dcfce7', color: '#1a7a4a', padding: '2px 8px', borderRadius: 3, fontSize: 10 }}>{meeting.tasks?.length} tasks</span>
          </div>
          <div style={{ padding: '8px 20px' }}>
            {meeting.tasks?.map((t, i) => <TaskItem key={t.id} task={t} index={i} />)}
          </div>
        </div>

        {/* Report */}
        <div style={{ gridColumn: '1 / -1' }}>
          <ReportView report={meeting.report} tasks={meeting.tasks} meetingId={meeting.id} />
        </div>

        {/* Raw Transcript */}
        <div style={{ gridColumn: '1 / -1', border: '1px solid #d4c9b8', background: '#fff' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #d4c9b8', background: '#ede7d9', fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>📄 Original Transcript</div>
          <div style={{ padding: 20 }}>
            <pre style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: '#3a3028' }}>{meeting.transcript}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
