'use client';

export default function TaskItem({ task, index, onStatusChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: '1px solid #d4c9b8' }}>
      {/* Number */}
      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 22, color: '#d4c9b8', flexShrink: 0, width: 28, lineHeight: 1, marginTop: 2 }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{task.task}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, padding: '2px 8px', borderRadius: 3, background: '#ede9fe', color: '#6d28d9' }}>
            👤 {task.owner}
          </span>
          {task.deadline && (
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, padding: '2px 8px', borderRadius: 3, background: '#fef3c7', color: '#92400e' }}>
              📅 {task.deadline}
            </span>
          )}
          {task.meeting_id && (
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, padding: '2px 8px', borderRadius: 3, background: '#f3f4f6', color: '#6b7280' }}>
              Meeting #{task.meeting_id}
            </span>
          )}
        </div>
      </div>

      {/* Status button */}
      {onStatusChange && (
        <button
          onClick={() => onStatusChange(task.id, task.status === 'Done' ? 'Pending' : 'Done')}
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 10,
            padding: '4px 10px',
            borderRadius: 3,
            border: task.status === 'Done' ? '1px solid #86efac' : '1px solid #d4c9b8',
            background: task.status === 'Done' ? '#dcfce7' : '#f5f0e8',
            color: task.status === 'Done' ? '#1a7a4a' : '#8a7d6b',
            cursor: 'pointer',
            letterSpacing: '0.5px',
            flexShrink: 0,
          }}
        >
          {task.status === 'Done' ? '✓ Done' : task.status || 'Pending'}
        </button>
      )}
    </div>
  );
}
