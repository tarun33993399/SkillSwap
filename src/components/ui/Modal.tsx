// ============================================================
// SKILLSWAP — Modal Component
// ============================================================
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = '500px' }: ModalProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const titleId = title ? 'modal-title' : undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="modal-wrapper"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(28,31,38,0.6)',
              backdropFilter: 'blur(4px)',
            }}
          />

          <style>{`
            .modal-panel {
              position: relative;
              width: 100%;
              max-width: ${maxWidth};
              background-color: var(--color-surface);
              border-radius: var(--radius-card);
              box-shadow: 0 20px 25px -5px rgba(28, 31, 38, 0.1), 0 10px 10px -5px rgba(28, 31, 38, 0.04);
              display: flex;
              flex-direction: column;
              max-height: 90vh;
            }
            @media (max-width: 639px) {
              .modal-wrapper {
                align-items: flex-end !important;
                padding: 0 !important;
              }
              .modal-panel {
                max-width: 100%;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                border-top-left-radius: 1rem;
                border-top-right-radius: 1rem;
                max-height: 95vh;
              }
            }
          `}</style>
          
          <motion.div
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {title ? (
                <h2 id={titleId} style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-charcoal)', margin: 0 }}>
                  {title}
                </h2>
              ) : <div />}
              
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-ink-soft)',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-cream-dark)';
                  e.currentTarget.style.color = 'var(--color-charcoal)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-ink-soft)';
                }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content (scrollable) */}
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

