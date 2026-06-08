'use client';
import { useState } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import FormattedReport from '@/components/FormattedReport';
import TaskItem from '@/components/TaskItem';
import { transcribeAudio, processMeeting } from '@/lib/api';

const STEPS = [
  'Connecting to API',
  'Agent 1: Summarizing meeting',
  'Agent 2: Extracting action items',
  'Agent 3: Building follow-up report',
];

export default function RecordPage() {
  const [mode, setMode] = useState('record'); // record | paste
  const [transcript, setTranscript] = useState('');
  const [transcriptionMeta, setTranscriptionMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Called by AudioRecorder when recording stops
  const handleRecorded = async (audioBlob, language) => {
    setError('');
    setLoading(true);
    setLoadStep(1);

    try {
      // Step 1: Transcribe audio
      const transcription = await transcribeAudio(audioBlob, language);
      setTranscript(transcription.transcript);
      setTranscriptionMeta({
        language: transcription.language,
        duration: transcription.duration,
        chars: transcription.transcript.length,
      });

      // Step 2: Run 3-agent pipeline
      setLoadStep(2);
      const t2 = setTimeout(() => setLoadStep(3), 1200);
      const t3 = setTimeout(() => setLoadStep(4), 2400);

      const data = await processMeeting(transcription.transcript);
      clearTimeout(t2);
      clearTimeout(t3);

      setLoadStep(5);
      setTimeout(() => {
        setResult(data);
        setLoading(false);
        setLoadStep(0);
      }, 500);

    } catch (e) {
      setError(e.message);
      setLoading(false);
      setLoadStep(0);
    }
  };

  // Run pipeline on pasted transcript
  const handlePastedRun = async () => {
    if (!transcript.trim()) return;
    setError('');
    setResult(null);
    setLoading(true);
    setLoadStep(1);

    const t2 = setTimeout(() => setLoadStep(2), 1200);
    const t3 = setTimeout(() => setLoadStep(3), 2400);

    try {
      const data = await processMeeting(transcript);
      clearTimeout(t2); clearTimeout(t3);
      setLoadStep(4);
      setTimeout(() => { setResult(data); setLoading(false); setLoadStep(0); }, 500);
    } catch (e) {
      setError(e.message); setLoading(false); setLoadStep(0);
      clearTimeout(t2); clearTimeout(t3);
    }
  };

  const reset = () => {
    setTranscript('');
    setResult(null);
    setError('');
    setTranscriptionMeta(null);
    setLoadStep(0);
  };

  return (
    <div>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid #d4c9b8' }}>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 40, letterSpacing: 1 }}>Record Meeting</h1>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b' }}>
          Audio → Transcript → AI Agents → Formatted Report
        </span>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', border: '1px solid #d4c9b8', overflow: 'hidden', marginBottom: 28 }}>
        {[
          { id: 'record', label: '🎙️ Record Audio' },
          { id: 'paste', label: '📋 Paste Transcript' },
        ].map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); reset(); }} style={{
            flex: 1, padding: '14px', fontFamily: 'var(--font-dm-mono)', fontSize: 11,
            letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', border: 'none',
            background: mode === m.id ? '#0a0a0a' : '#f5f0e8',
            color: mode === m.id ? '#f5f0e8' : '#8a7d6b',
            transition: 'all 0.2s',
          }}>{m.label}</button>
        ))}
      </div>

      {/* ── RECORD MODE ── */}
      {mode === 'record' && (
        <div style={{ border: '2px solid #0a0a0a', background: '#fff', overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '16px 24px', background: '#0a0a0a', color: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 22, letterSpacing: 1 }}>🎙️ Voice Recording</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'rgba(245,240,232,0.5)', letterSpacing: 1 }}>
              Powered by Groq Whisper Large V3
            </div>
          </div>
          <div style={{ padding: 32 }}>
            <AudioRecorder
              onTranscribed={handleRecorded}
              onError={setError}
            />
          </div>
        </div>
      )}

      {/* ── PASTE MODE ── */}
      {mode === 'paste' && (
        <div style={{ border: '2px solid #0a0a0a', background: '#fff', overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '10px 16px', background: '#ede7d9', borderBottom: '1px solid #d4c9b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      )}

      {/* ── TRANSCRIPTION RESULT META ── */}
      {transcriptionMeta && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '3px solid #1a7a4a', padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', borderRadius: '0 6px 6px 0' }}>
          <span style={{ color: '#1a7a4a', fontWeight: 600 }}>✓ Transcription complete</span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, background: '#dcfce7', color: '#1a7a4a', padding: '2px 8px', borderRadius: 3 }}>
            {transcriptionMeta.language?.toUpperCase()}
          </span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, background: '#dbeafe', color: '#1a6bc8', padding: '2px 8px', borderRadius: 3 }}>
            ⏱ {Math.round(transcriptionMeta.duration)}s
          </span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b' }}>
            {transcriptionMeta.chars} characters
          </span>
        </div>
      )}

      {/* ── TRANSCRIPT PREVIEW (after recording) ── */}
      {transcript && mode === 'record' && (
        <div style={{ border: '1px solid #d4c9b8', background: '#fff', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '10px 16px', background: '#ede7d9', borderBottom: '1px solid #d4c9b8', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8a7d6b' }}>📝 Transcribed Text — Edit if needed</span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b' }}>{transcript.length} chars</span>
          </div>
          <textarea
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            style={{ width: '100%', minHeight: 140, padding: '16px 24px', border: 'none', outline: 'none', fontFamily: 'var(--font-outfit)', fontSize: 14, lineHeight: 1.7, background: '#fff', resize: 'vertical' }}
          />
        </div>
      )}

      {/* ── ACTION BUTTONS ── */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
        {(mode === 'paste' || (mode === 'record' && transcript)) && (
          <button
            onClick={handlePastedRun}
            disabled={loading || !transcript.trim()}
            style={{
              background: loading || !transcript.trim() ? '#8a7d6b' : '#0a0a0a',
              color: '#f5f0e8', border: 'none', padding: '16px 40px',
              fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: 2,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '⚙ Processing...' : '⚡ Run AI Pipeline'}
          </button>
        )}
        {(transcript || result) && (
          <button onClick={reset} style={{ background: 'transparent', color: '#8a7d6b', border: '1px solid #d4c9b8', padding: '10px 20px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}>
            Clear & Start Over
          </button>
        )}
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ height: 3, background: '#d4c9b8', overflow: 'hidden', marginBottom: 12 }}>
            <div className="shimmer" style={{ height: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-dm-mono)', fontSize: 11,
                color: loadStep > i + 1 ? '#1a7a4a' : loadStep === i + 1 ? '#c8401a' : '#8a7d6b',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
                {loadStep > i + 1 ? '✓ ' : ''}{s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ERROR ── */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '3px solid #dc2626', padding: '14px 18px', fontFamily: 'var(--font-dm-mono)', fontSize: 13, color: '#dc2626', marginBottom: 20, borderRadius: '0 6px 6px 0' }}>
          ⚠ {error}
        </div>
      )}

      {/* ── RESULTS ── */}
      {result && (
        <div className="fade-up">
          {/* Success banner */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '3px solid #1a7a4a', padding: '14px 18px', marginBottom: 24, borderRadius: '0 6px 6px 0', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ color: '#1a7a4a', fontWeight: 600 }}>✓ Pipeline complete</span>
            <span style={{ background: '#0a0a0a', color: '#f5f0e8', fontFamily: 'var(--font-dm-mono)', fontSize: 12, padding: '4px 12px', letterSpacing: 1 }}>
              Meeting ID <strong style={{ color: '#c4a032' }}>#{result.meeting_id}</strong>
            </span>
            <span style={{ color: '#8a7d6b', fontSize: 12 }}>Saved to database</span>
          </div>

          {/* Summary + Tasks grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
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
          </div>

          {/* Full Formatted Report */}
          <FormattedReport
            reportText={result.report_text}
            meetingId={result.meeting_id}
            tasks={result.tasks}
            summary={result.summary}
            report={result.report}
          />
        </div>
      )}
    </div>
  );
}
