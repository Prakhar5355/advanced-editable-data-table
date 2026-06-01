import React from 'react';

const STATUS_COLORS = {
  'Active':    '#22c55e',
  'Inactive':  '#94a3b8',
  'On Leave':  '#f59e0b',
  'Remote':    '#3b82f6',
  'Contract':  '#a855f7',
};

export function StatusBadge({ value }) {
  const color = STATUS_COLORS[value] || '#94a3b8';
  return (
    <span className="status-badge" style={{ '--badge-color': color }}>
      <span className="badge-dot" />
      {value}
    </span>
  );
}
