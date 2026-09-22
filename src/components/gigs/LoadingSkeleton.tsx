// ============================================================
// SKILLSWAP — LoadingSkeleton (Gigs)
// ============================================================
import { motion } from 'framer-motion';

export default function LoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: '100%',
          }}
        >
          {/* Image placeholder */}
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.8 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
            style={{ height: '200px', backgroundColor: 'var(--color-cream-dark)' }}
          />

          <div style={{ padding: '1.125rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Seller row placeholder */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0.8 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1, delay: 0.1 }}
                style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-cream-dark)' }}
              />
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0.8 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1, delay: 0.2 }}
                style={{ width: '100px', height: '14px', borderRadius: '4px', backgroundColor: 'var(--color-cream-dark)' }}
              />
            </div>

            {/* Title placeholders */}
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0.8 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1, delay: 0.3 }}
              style={{ width: '100%', height: '18px', borderRadius: '4px', backgroundColor: 'var(--color-cream-dark)', marginBottom: '0.5rem' }}
            />
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0.8 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1, delay: 0.4 }}
              style={{ width: '75%', height: '18px', borderRadius: '4px', backgroundColor: 'var(--color-cream-dark)', marginBottom: '1rem' }}
            />

            {/* Tags placeholders */}
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem' }}>
              <motion.div style={{ width: '50px', height: '22px', borderRadius: '999px', backgroundColor: 'var(--color-cream-dark)' }} />
              <motion.div style={{ width: '60px', height: '22px', borderRadius: '999px', backgroundColor: 'var(--color-cream-dark)' }} />
            </div>

            <hr className="divider" style={{ marginBottom: '1rem' }} />

            {/* Footer row placeholder */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <motion.div style={{ width: '60px', height: '16px', borderRadius: '4px', backgroundColor: 'var(--color-cream-dark)' }} />
              <motion.div style={{ width: '80px', height: '24px', borderRadius: '4px', backgroundColor: 'var(--color-cream-dark)' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

