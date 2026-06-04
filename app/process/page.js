'use client';
import { useState } from 'react';
import { processMeeting } from '@/lib/api';
import { SAMPLE_TRANSCRIPT } from '@/lib/constants';
import TaskItem from '@/components/TaskItem';
import ReportView from '@/components/ReportView';

const STEPS = ['Connecting', 'Agent 1: Summarizing', 'Agent 2: Extracting Tasks', 'Agent 3: Building Report'];

export default function ProcessPage() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const run = async () => {
    if (!transcript.trim()) return;
    setLoading(true); setError(''); setResult(null); setStep(1);
    const t1 = setTimeout(() => setStep(2), 1200);
    const t2 = setTimeout(() => setStep(3), 2400);
    try {
      const data = await processMeeting(transcript);
      setStep(4);
      setTimeout(() => { setResult(data); setLoading(false); setStep(0); }, 600);
    } catch (e) {
      setError(e.message); setLoading(false); setStep(0);
      clearTimeout(t1); clearTimeout(t2);
    }
  };

  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid #d4c9b8' }}>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 40, letterSpacing: 1 }}>Process Transcript</h1>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b', letterSpacing: 1 }}>Run the full 3-agent pipeline</span>
      </div>

      {/* Input */}
      <div style={{ border: '2px solid #0a0a0a', background: '#fff', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #d4c9b8', background: '#ede7d9' }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a7d6b' }}>Meeting Transcript</span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b' }}>{transcript.length} chars</span>
        </div>
        <textarea
          value={transcript}
          onChange={e => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          style={{ width: '100%', minHeight: 200, padding: '20px 24px', border: 'none', outline: 'none', fontFamily: 'var(--font-outfit)', fontSize: 15, lineHeight: 1.7, background: '#fff', resize: 'vertical' }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={run} disabled={loading || !transcript.trim()} style={{
          background: loading || !transcript.trim() ? '#8a7d6b' : '#0a0a0a',
          color: '#f5f0e8', border: '2px solid currentColor', padding: '16px 40px',
          fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? '⚙ Processing...' : '⚡ Run AI Pipeline'}
        </button>
        <button onClick={() => setTranscript(SAMPLE_TRANSCRIPT)} style={{ background: 'transparent', color: '#8a7d6b', border: '1px solid #d4c9b8', padding: '10px 20px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
          Load Sample
        </button>
        {transcript && (
          <button onClick={() => { setTranscript(''); setResult(null); setError(''); }} style={{ background: 'transparent', color: '#8a7d6b', border: '1px solid #d4c9b8', padding: '10px 20px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
            Clear
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ marginTop: 20 }}>
          <div style={{ height: 3, background: '#d4c9b8', overflow: 'hidden' }}>
            <div className="shimmer" style={{ height: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: step > i + 1 ? '#1a7a4a' : step === i + 1 ? '#c8401a' : '#8a7d6b' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
                {step > i + 1 ? '✓ ' : ''}{s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '3px solid #dc2626', padding: '14px 18px', fontFamily: 'var(--font-dm-mono)', fontSize: 13, color: '#dc2626', margin: '16px 0', borderRadius: '0 6px 6px 0' }}>
          ⚠ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="fade-up" style={{ marginTop: 32 }}>
          {/* Success banner */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '3px solid #1a7a4a', padding: '14px 18px', fontSize: 13, color: '#1a7a4a', marginBottom: 24, borderRadius: '0 6px 6px 0', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span>✓ Pipeline complete</span>
            <span style={{ background: '#0a0a0a', color: '#f5f0e8', fontFamily: 'var(--font-dm-mono)', fontSize: 12, padding: '4px 12px' }}>
              Meeting ID <strong style={{ color: '#c4a032' }}>#{result.meeting_id}</strong>
            </span>
            <span style={{ color: '#8a7d6b', fontSize: 12 }}>Saved to database</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Summary */}
            <div style={{ border: '1px solid #d4c9b8', background: '#fff', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #d4c9b8', background: '#ede7d9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>📝 Agent 1 — Summary</span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, padding: '2px 8px', borderRadius: 3, background: '#dbeafe', color: '#1a6bc8' }}>Groq LLaMA</span>
              </div>
              <div style={{ padding: 20, fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-line', color: '#3a3028' }}>
                {result.summary}
              </div>
            </div>

            {/* Tasks */}
            <div style={{ border: '1px solid #d4c9b8', background: '#fff', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #d4c9b8', background: '#ede7d9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>✅ Agent 2 — Action Items</span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, padding: '2px 8px', borderRadius: 3, background: '#dcfce7', color: '#1a7a4a' }}>{result.tasks.length} tasks</span>
              </div>
              <div style={{ padding: '8px 20px' }}>
                {result.tasks.map((t, i) => <TaskItem key={i} task={t} index={i} />)}
              </div>
            </div>

            {/* Report full width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <ReportView report={result.report} tasks={result.tasks} meetingId={result.meeting_id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
