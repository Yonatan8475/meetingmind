'use client';
import { useState } from 'react';
import { TRACKER_PRESETS } from '@/lib/constants';
import { processMeeting } from '@/lib/api';
import ReportView from '@/components/ReportView';

export default function TrackerPage() {
  const [tasks, setTasks] = useState([{ task: '', owner: '', deadline: '' }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const add = () => setTasks(p => [...p, { task: '', owner: '', deadline: '' }]);
  const remove = i => setTasks(p => p.filter((_, idx) => idx !== i));
  const update = (i, f, v) => setTasks(p => p.map((t, idx) => idx === i ? { ...t, [f]: v } : t));
  const loadPreset = p => { setTasks(p.tasks.map(t => ({ ...t }))); setResult(null); };

  // Run locally — mirrors Python tracker logic exactly
  const runLocal = async () => {
    const valid = tasks.filter(t => t.task.trim());
    if (!valid.length) return;
    setLoading(true); setResult(null);
    await new Promise(r => setTimeout(r, 500));
    const lines = ['FOLLOW-UP REPORT', ''];
    valid.forEach((t, i) => {
      lines.push(`${i + 1}. ${t.task} → ${t.owner || 'Unknown'} → Due: ${t.deadline || 'No deadline'} → Status: Pending`);
    });
    setResult({ tasks: valid, report: lines.join('\n') });
    setLoading(false);
  };

  // Run via live API — saves to database
  const runAPI = async () => {
    const valid = tasks.filter(t => t.task.trim());
    if (!valid.length) return;
    setLoading(true); setResult(null);
    try {
      const fake = valid.map(t => `${t.owner} will ${t.task}. Deadline is ${t.deadline || 'TBD'}.`).join(' ');
      const data = await processMeeting(fake);
      setResult({ tasks: data.tasks, report: data.report, meeting_id: data.meeting_id });
    } catch (e) { alert(e.message); }
    setLoading(false);
  };

  const inputStyle = { border: '1px solid #d4c9b8', padding: '9px 12px', fontFamily: 'var(--font-outfit)', fontSize: 13, background: '#f5f0e8', outline: 'none', width: '100%', transition: 'border-color 0.15s' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid #d4c9b8' }}>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 40, letterSpacing: 1 }}>Agent 3 — Tracker</h1>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b' }}>Build and test the tracker directly</span>
      </div>

      {/* Info banner */}
      <div style={{ background: '#0a0a0a', color: '#f5f0e8', padding: 24, marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: 1, color: '#c4a032', marginBottom: 8 }}>🔍 What is the Tracker Agent?</div>
        <div style={{ fontSize: 13, color: 'rgba(245,240,232,0.7)', lineHeight: 1.7 }}>
          Agent 3 receives extracted tasks from Agent 2 and formats them into a structured follow-up report. Each task gets an owner, deadline, and status. Test it here with custom tasks — no AI call needed, pure Python logic mirrored in JavaScript.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* LEFT — Task Builder */}
        <div style={{ border: '2px solid #0a0a0a', background: '#fff', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', background: '#0a0a0a', color: '#f5f0e8', fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
            <span>Task Input</span>
            <span style={{ color: '#c4a032' }}>{tasks.filter(t => t.task.trim()).length} tasks ready</span>
          </div>
          <div style={{ padding: 20 }}>
            {/* Presets */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: '#8a7d6b', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Quick Load Presets</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {TRACKER_PRESETS.map((p, i) => (
                  <button key={i} onClick={() => loadPreset(p)} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, padding: '8px 12px', border: '1px solid #d4c9b8', background: '#f5f0e8', cursor: 'pointer', color: '#8a7d6b', textAlign: 'left', lineHeight: 1.4, transition: 'all 0.15s' }}>
                    {p.label}<br /><span style={{ fontSize: 10, opacity: 0.7 }}>{p.tasks.length} tasks</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Task rows */}
            <div style={{ borderTop: '1px solid #d4c9b8', paddingTop: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                {['Task', 'Owner', 'Deadline', ''].map((h, i) => (
                  <div key={i} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: '#8a7d6b', letterSpacing: 1, textTransform: 'uppercase' }}>{h}</div>
                ))}
              </div>
              {tasks.map((t, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input style={inputStyle} placeholder="e.g. Build API backend" value={t.task} onChange={e => update(i, 'task', e.target.value)} />
                  <input style={inputStyle} placeholder="e.g. John" value={t.owner} onChange={e => update(i, 'owner', e.target.value)} />
                  <input style={inputStyle} placeholder="e.g. Friday" value={t.deadline} onChange={e => update(i, 'deadline', e.target.value)} />
                  <button onClick={() => remove(i)} style={{ background: 'none', border: '1px solid #d4c9b8', color: '#8a7d6b', width: 36, height: 36, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              ))}
              <button onClick={add} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#1a6bc8', border: '1px dashed #1a6bc8', padding: '10px 16px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', width: '100%', justifyContent: 'center', marginTop: 8 }}>
                + Add Task
              </button>
            </div>

            {/* Run buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
              <button onClick={runLocal} disabled={loading || !tasks.some(t => t.task.trim())} style={{ background: '#c8401a', color: 'white', border: 'none', padding: '14px', fontFamily: 'var(--font-bebas)', fontSize: 17, letterSpacing: 2, cursor: 'pointer' }}>
                ▶ Local Run
              </button>
              <button onClick={runAPI} disabled={loading || !tasks.some(t => t.task.trim())} style={{ background: '#1a6bc8', color: 'white', border: 'none', padding: '14px', fontFamily: 'var(--font-bebas)', fontSize: 17, letterSpacing: 2, cursor: 'pointer' }}>
                🌐 Via API
              </button>
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: '#8a7d6b', marginTop: 8, textAlign: 'center' }}>
              Local = instant · API = saves to database
            </div>
          </div>
        </div>

        {/* RIGHT — Output */}
        <div>
          {!result && !loading && (
            <div style={{ border: '2px solid #d4c9b8', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', textAlign: 'center', height: '100%' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>📊</div>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 24, letterSpacing: 1, marginBottom: 8 }}>No Report Yet</div>
              <div style={{ fontSize: 13, color: '#8a7d6b', lineHeight: 1.6 }}>Add tasks on the left and click Run Tracker to see Agent 3 in action</div>
            </div>
          )}
          {loading && (
            <div style={{ border: '2px solid #d4c9b8', background: '#fff', padding: 40 }}>
              <div style={{ height: 3, background: '#d4c9b8', overflow: 'hidden', marginBottom: 16 }}>
                <div className="shimmer" style={{ height: '100%' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: '#8a7d6b' }}>Agent 3 is building your report...</div>
            </div>
          )}
          {result && (
            <div className="fade-up">
              <ReportView report={result.report} tasks={result.tasks} meetingId={result.meeting_id} />
            </div>
          )}

          {/* How it works */}
          <div style={{ marginTop: 16, padding: 16, background: '#ede7d9', border: '1px solid #d4c9b8' }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#8a7d6b', marginBottom: 10 }}>How Agent 3 Works</div>
            <div style={{ fontSize: 13, lineHeight: 1.8, color: '#3a3028' }}>
              The Tracker Agent receives task dictionaries from Agent 2. It formats each one as:{' '}
              <code style={{ fontFamily: 'var(--font-dm-mono)', background: '#f5f0e8', padding: '1px 6px', fontSize: 12 }}>
                task → owner → Due: deadline → Status: Pending
              </code>. No AI call — pure Python logic, making it instant and reliable.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
