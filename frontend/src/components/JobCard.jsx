import React from 'react';
import { Bookmark, CheckCircle2, MapPin, Pencil, Trash2 } from 'lucide-react';

export default function JobCard({
  job,
  featured = false,
  isSaved = false,
  isApplied = false,
  onOpen,
  onApply,
  onSave,
  onEdit,
  onDelete,
}) {
  return (
    <article
      onClick={onOpen}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px',
        borderRadius: '18px',
        border: '1px solid var(--border-color)',
        background: featured
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.04))'
          : 'rgba(0, 0, 0, 0.02)',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>{job.title}</h2>
          <div style={{ marginTop: '4px', color: 'var(--text-secondary)', fontWeight: 600 }}>{job.company}</div>
        </div>
        <div
          style={{
            padding: '8px 12px',
            borderRadius: '999px',
            border: '1px solid var(--border-color)',
            background: 'var(--card-bg)',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--text-secondary)',
          }}
        >
          {job.experience || 'Open role'}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
        <MapPin size={16} />
        <span>{job.location}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {(job.skills || []).map((skill) => (
          <span
            key={skill}
            style={{
              padding: '6px 10px',
              borderRadius: '999px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
        <ActionButton
          label={isApplied ? 'Applied' : 'Apply'}
          icon={<CheckCircle2 size={16} />}
          active={isApplied}
          onClick={onApply}
        />
        <ActionButton
          label={isSaved ? 'Saved' : 'Save'}
          icon={<Bookmark size={16} />}
          active={isSaved}
          onClick={onSave}
        />
        {onEdit && <ActionButton label="Edit" icon={<Pencil size={16} />} onClick={onEdit} />}
        {onDelete && <ActionButton label="Delete" icon={<Trash2 size={16} />} onClick={onDelete} danger />}
      </div>
    </article>
  );
}

function ActionButton({ label, icon, active = false, danger = false, onClick }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        borderRadius: '999px',
        border: active || danger ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
        background: active ? 'rgba(0, 137, 56, 0.08)' : '#fff',
        color: danger ? '#b42318' : active ? 'var(--accent-color)' : 'var(--text-secondary)',
        fontSize: '13px',
        fontWeight: 700,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
