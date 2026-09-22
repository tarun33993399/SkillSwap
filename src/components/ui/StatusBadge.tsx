// ============================================================
// SKILLSWAP — StatusBadge
// ============================================================
import type { BookingStatus } from '@/types';

interface StatusBadgeProps {
  status: BookingStatus | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = 'var(--color-cream-dark)';
  let textColor = 'var(--color-ink-soft)';
  let label = status.charAt(0).toUpperCase() + status.slice(1);

  switch (status.toLowerCase()) {
    case 'pending':
      bgColor = 'var(--color-accent-light)'; // Accent tinted
      textColor = 'var(--color-accent-hover)';
      break;
    case 'accepted':
      // A warm, sophisticated sage/olive green rather than a generic app green
      bgColor = 'rgba(85, 107, 85, 0.12)'; 
      textColor = '#475C47';
      break;
    case 'declined':
      bgColor = 'rgba(154, 76, 69, 0.10)';
      textColor = 'var(--color-error)';
      break;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.75rem',
        borderRadius: '999px',
        backgroundColor: bgColor,
        color: textColor,
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  );
}

