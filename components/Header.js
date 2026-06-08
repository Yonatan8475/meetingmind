'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkHealth } from '@/lib/api';

const NAV = [
  { href: '/',          label: '🏠 Dashboard' },
  { href: '/record',    label: '🎙️ Record' },
  { href: '/process',   label: '⚡ Process' },
  { href: '/tracker',   label: '🔍 Tracker' },
  { href: '/meetings',  label: '📋 Meetings' },
  { href: '/tasks',     label: '✅ Tasks' },
];

export default function Header() {
  const pathname = usePathname();
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const check = async () => setOnline(await checkHealth());
    check();
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <header style={{ borderBottom: '2px solid #0a0a0a', background: '#f5f0e8', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>

        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingRight: 32, borderRight: '1px solid #d4c9b8', paddingTop: 18, paddingBottom: 18 }}>
          <div style={{ width: 36, height: 36, background: '#0a0a0a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧠</div>
          <div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 22, letterSpacing: 2, lineHeight: 1 }}>MeetingMind</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: '#8a7d6b', letterSpacing: 2, textTransform: 'uppercase' }}>AI Meeting Intelligence</div>
          </div>
        </div>

        {/* NAV */}
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          {NAV.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{
                padding: '0 18px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: 11,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: active ? '#c8401a' : '#8a7d6b',
                borderRight: '1px solid #d4c9b8',
                borderBottom: active ? '3px solid #c8401a' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </Link>
            );
          })}

          {/* API STATUS */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 16px',
            background: online ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${online ? '#86efac' : '#fca5a5'}`,
            borderRadius: 100,
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 11,
            color: online ? '#1a7a4a' : '#dc2626',
            marginLeft: 20,
            whiteSpace: 'nowrap',
          }}>
            <div className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
            {online ? 'API Live' : 'API Offline'}
          </div>
        </nav>
      </div>
    </header>
  );
}
