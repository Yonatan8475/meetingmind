'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMeetings, getTasks } from '@/lib/api';
import { AGENTS } from '@/lib/constants';
import StatCard from '@/components/StatCard';

export default function Dashboard() {
  const [stats, setStats] = useState({ meetings: 0, tasks: 0, done: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([getMeetings(), getTasks()])
      .then(([m, t]) => {
        setStats({ meetings: m.length, tasks: t.length, done: t.filter(x => x.status === 'Done').length });
        setRecent(m.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '2px solid #0a0a0a', marginBottom: 48, overflow: 'hidden' }}>
        <div style={{ padding: '56px 48px', background: '#0a0a0a', color: '#f5f0e8', borderRight: '2px solid #0a0a0a' }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c4a032', marginBottom: 20 }}>
            // Multi-Agent AI System
          </div>
          <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(52px, 6vw, 88px)', letterSpacing: 2, lineHeight: 0.95, marginBottom: 20 }}>
            Turn Meetings<br />
            Into{' '}
            <em style={{ fontStyle: 'italic', color: '#c8401a', fontFamily: 'Georgia, serif' }}>Action</em>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(245,240,232,0.65)', lineHeight: 1.8, maxWidth: 400 }}>
            Three specialized AI agents process your transcript — summarizing, extracting action items, and generating a structured follow-up report. Powered by Groq LLaMA 3.3.
          </p>
          <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
            <Link href="/process" style={{
              background: '#c8401a', color: 'white', padding: '14px 32px',
              fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: 2,
              textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s',
            }}>
              ⚡ Process Transcript
            </Link>
            <Link href="/tracker" style={{
              background: 'transparent', color: '#f5f0e8', padding: '14px 24px',
              fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: 2,
              textDecoration: 'none', display: 'inline-block', border: '1px solid rgba(245,240,232,0.3)',
              textTransform: 'uppercase',
            }}>
              🔍 Test Tracker
            </Link>
          </div>
        </div>

        <div style={{ padding: 48, background: '#ede7d9' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#d4c9b8', border: '1px solid #d4c9b8', marginBottom: 28 }}>
            <StatCard num={stats.meetings} label="Meetings Processed" />
            <StatCard num={stats.tasks} label="Tasks Extracted" />
            <StatCard num={stats.done} label="Tasks Completed" />
            <StatCard num="3" label="AI Agents Active" />
          </div>

          {/* Agents */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {AGENTS.map(a => (
              <div key={a.num} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#f5f0e8', border: '1px solid #d4c9b8', borderRadius: 6 }}>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 20, color: '#8a7d6b', width: 24, lineHeight: 1, flexShrink: 0 }}>{a.num}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: '#8a7d6b' }}>{a.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-dm-mono)', fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#1a7a4a', border: '1px solid #86efac' }}>
                  {a.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
        {[
          { href: '/process', icon: '⚡', label: 'Process Meeting', desc: 'Run the full 3-agent pipeline on a transcript' },
          { href: '/tracker', icon: '🔍', label: 'Test Tracker', desc: 'Build and test Agent 3 directly with custom tasks' },
          { href: '/meetings', icon: '📋', label: 'View History', desc: 'Browse all previously processed meetings' },
          { href: '/tasks', icon: '✅', label: 'Manage Tasks', desc: 'View and update status of all extracted tasks' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none', border: '1px solid #d4c9b8', background: '#fff', padding: 24, display: 'block', transition: 'all 0.2s' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 20, letterSpacing: 1, marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 13, color: '#8a7d6b', lineHeight: 1.6 }}>{item.desc}</div>
          </Link>
        ))}
      </div>

      {/* RECENT MEETINGS */}
      {recent.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #d4c9b8' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 28, letterSpacing: 1 }}>Recent Meetings</div>
            <Link href="/meetings" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b', letterSpacing: 1, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ border: '1px solid #d4c9b8', background: '#fff' }}>
            {recent.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: '1px solid #d4c9b8' }}>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 28, color: '#d4c9b8', width: 40, lineHeight: 1 }}>#{m.id}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
                    {m.summary?.slice(0, 120)}...
                  </div>
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b' }}>
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
                <Link href={`/meetings/${m.id}`} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, background: '#dbeafe', color: '#1a6bc8', padding: '3px 12px', borderRadius: 3, textDecoration: 'none' }}>
                  View →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
