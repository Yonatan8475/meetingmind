'use client';
import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '@/lib/api';
import TaskItem from '@/components/TaskItem';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getTasks().then(data => { setTasks(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    await updateTaskStatus(id, status);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const statuses = ['All', 'Pending', 'In Progress', 'Done', 'Cancelled'];
  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid #d4c9b8', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 40, letterSpacing: 1 }}>All Tasks</h1>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b' }}>{tasks.length} total · {tasks.filter(t => t.status === 'Done').length} done</span>
        </div>
        {/* Filter */}
        <div style={{ display: 'flex', gap: 8 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, padding: '4px 12px',
              border: '1px solid #d4c9b8', cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase',
              background: filter === s ? '#0a0a0a' : 'transparent',
              color: filter === s ? '#f5f0e8' : '#8a7d6b',
              borderRadius: 3,
            }}>{s}</button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ height: 3, background: '#d4c9b8', overflow: 'hidden', marginBottom: 24 }}>
          <div className="shimmer" style={{ height: '100%' }} />
        </div>
      )}

      <div style={{ border: '1px solid #d4c9b8', background: '#fff' }}>
        {filtered.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 40px', color: '#8a7d6b' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>✅</div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 24, letterSpacing: 1, marginBottom: 8, color: '#0a0a0a' }}>No tasks yet</div>
            <div style={{ fontSize: 13 }}>Process a transcript to extract action items</div>
          </div>
        )}
        <div style={{ padding: '0 20px' }}>
          {filtered.map((t, i) => (
            <TaskItem key={t.id} task={t} index={i} onStatusChange={handleStatus} />
          ))}
        </div>
      </div>
    </div>
  );
}
