import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import { useUIStore } from '@/store';

export default function RootLayout() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />

      {/* Global Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-cream)',
                padding: '0.9rem 1rem',
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-card-hover)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                pointerEvents: 'auto',
                minWidth: 'min(280px, calc(100vw - 2rem))',
              }}
              onClick={() => removeToast(toast.id)}
            >
              <span style={{ color: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-accent-hover)', fontSize: '1.1rem' }}>{toast.type === 'success' ? '✓' : '!'}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--color-charcoal)', fontWeight: 700, fontSize: '0.875rem' }}>{toast.title}</span>
                {toast.message && <span style={{ color: 'var(--color-ink-soft)', fontSize: '0.75rem' }}>{toast.message}</span>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

