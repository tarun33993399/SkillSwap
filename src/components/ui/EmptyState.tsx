// ============================================================
// SKILLSWAP — EmptyState
// ============================================================
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No results found',
  message = 'We couldn\'t find anything matching your criteria. Try adjusting your filters or search terms.',
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1rem',
        textAlign: 'center',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        border: '1.5px dashed var(--color-border)',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-cream-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-ink-muted)',
          marginBottom: '1.5rem',
        }}
      >
        <SearchX size={32} />
      </div>
      
      <h3
        style={{
          fontFamily: 'var(--font-family-display)',
          fontWeight: 700,
          fontSize: '1.25rem',
          color: 'var(--color-charcoal)',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      
      <p
        style={{
          fontSize: '0.9375rem',
          color: 'var(--color-ink-soft)',
          maxWidth: '400px',
          lineHeight: 1.6,
          marginBottom: onAction ? '2rem' : 0,
        }}
      >
        {message}
      </p>

      {onAction && actionLabel && (
        <button className="btn-ghost" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

