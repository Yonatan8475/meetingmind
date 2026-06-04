export default function StatCard({ num, label }) {
  return (
    <div style={{ background: '#f5f0e8', padding: '20px 24px' }}>
      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 40, letterSpacing: 1, lineHeight: 1, marginBottom: 4 }}>
        {num}
      </div>
      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: '#8a7d6b', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}
