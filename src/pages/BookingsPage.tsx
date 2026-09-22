import { useState } from 'react';
import { CalendarClock, ArrowRight, Clock3, ExternalLink, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import type { Booking } from '@/types';
import { UsersAPI } from '@/lib/api';
import { useAuthStore, useBookingStore, useGigStore } from '@/store';
import { formatDate, formatPrice } from '@/lib/utils';
import { CATEGORIES } from '@/data/seed';

import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';

type BookingFilter = 'all' | 'pending' | 'accepted' | 'declined';

const filters: { label: string; value: BookingFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Declined', value: 'declined' },
];

function BookingCard({ booking, onViewDetails }: { booking: Booking; onViewDetails: (requirements: string) => void }) {
  const navigate = useNavigate();
  const gig = useGigStore((state) => state.gigs.find((item) => item.id === booking.gigId) ?? null);
  const creatorResult = UsersAPI.getById(booking.creatorId);
  const creator = creatorResult.ok ? creatorResult.data : null;

  const category = gig ? CATEGORIES.find((item) => item.id === gig.categoryId) : undefined;
  const requirementsPreview = booking.requirements.length > 105
    ? `${booking.requirements.slice(0, 105).trimEnd()}...`
    : booking.requirements;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="card"
      style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <StatusBadge status={booking.status} />
        <span style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-charcoal)', whiteSpace: 'nowrap' }}>{formatPrice(booking.rate)}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {creator?.avatar ? (
          <img src={creator.avatar} alt={creator.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)', flexShrink: 0 }} />
        ) : (
          <span style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><UserRound size={18} /></span>
        )}
        <div style={{ minWidth: 0 }}>
          <span style={{ display: 'block', color: 'var(--color-ink-muted)', fontSize: '0.75rem', marginBottom: '0.1rem' }}>Creator</span>
          <strong style={{ color: 'var(--color-charcoal)', fontFamily: 'var(--font-family-display)', fontSize: '0.95rem' }}>{creator?.name || 'Creator unavailable'}</strong>
        </div>
      </div>

      <div>
        {gig ? (
          <Link to={`/gig/${gig.id}`} style={{ color: 'var(--color-charcoal)', textDecoration: 'none' }}>
            <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.1rem', lineHeight: 1.35, marginBottom: '0.5rem' }}>{gig.title}</h2>
          </Link>
        ) : (
          <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.1rem', lineHeight: 1.35, color: 'var(--color-ink-soft)', marginBottom: '0.5rem' }}>Service no longer available</h2>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', color: 'var(--color-ink-muted)', fontSize: '0.78rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock3 size={13} /> {category?.name || 'Category unavailable'}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><CalendarClock size={13} /> {formatDate(booking.createdAt)}</span>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-cream-dark)', borderRadius: '8px', padding: '0.9rem' }}>
        <span style={{ display: 'block', color: 'var(--color-ink-muted)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Requirements</span>
        <p style={{ color: 'var(--color-ink)', fontSize: '0.875rem', lineHeight: 1.55, margin: 0 }}>&quot;{requirementsPreview}&quot;</p>
        {(requirementsPreview !== booking.requirements) && <button type="button" onClick={() => onViewDetails(booking.requirements)} style={{ border: 0, background: 'none', color: 'var(--color-accent-hover)', cursor: 'pointer', fontWeight: 700, padding: '0.45rem 0 0', textDecoration: 'underline' }}>View Details</button>}
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.9rem', minHeight: '3.9rem' }}>
        {booking.status === 'pending' && <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.8125rem', margin: 0 }}>Waiting for the creator to respond.</p>}
        {booking.status === 'accepted' && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}><p style={{ color: 'var(--color-ink-soft)', fontSize: '0.8125rem', margin: 0 }}>Your booking has been accepted by the creator.</p>{gig && <Link to={`/gig/${gig.id}`} className="btn-ghost" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}>View Service <ExternalLink size={14} /></Link>}</div>}
        {booking.status === 'declined' && <><p style={{ color: 'var(--color-ink-soft)', fontSize: '0.8125rem', margin: '0 0 0.75rem' }}>This creator isn&apos;t available for this request.</p>{category && <button type="button" className="btn-primary" onClick={() => navigate(`/discover?category=${category.slug}`)} style={{ padding: '0.55rem 0.8rem', fontSize: '0.8125rem' }}>Browse Similar Gigs <ArrowRight size={14} /></button>}</>}
      </div>
    </motion.article>
  );
}

export default function BookingsPage() {
  const { currentUser, isAuthenticated } = useAuthStore();
  const { forClient } = useBookingStore();
  const [activeFilter, setActiveFilter] = useState<BookingFilter>('all');
  const [selectedRequirements, setSelectedRequirements] = useState<string | null>(null);

  if (!isAuthenticated || !currentUser) return null;

  const bookings = forClient(currentUser.id);
  const visibleBookings = activeFilter === 'all' ? bookings : bookings.filter((booking) => booking.status === activeFilter);

  return (
    <div className="container-xl section-pad" style={{ paddingBottom: '6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--color-charcoal)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>My Bookings</h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>Track your project requests and stay updated on every service you&apos;ve booked.</p>
      </div>

      {bookings.length > 0 && <div role="group" aria-label="Filter bookings" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '2rem' }}>{filters.map((filter) => <button key={filter.value} type="button" aria-pressed={activeFilter === filter.value} onClick={() => setActiveFilter(filter.value)} style={{ border: `1px solid ${activeFilter === filter.value ? 'var(--color-accent)' : 'var(--color-border)'}`, backgroundColor: activeFilter === filter.value ? 'var(--color-accent-light)' : 'var(--color-surface)', color: activeFilter === filter.value ? 'var(--color-accent-hover)' : 'var(--color-ink-soft)', borderRadius: 'var(--radius-pill)', padding: '0.55rem 1rem', fontWeight: 700, cursor: 'pointer' }}>{filter.label}</button>)}</div>}

      {bookings.length === 0 ? (
        <EmptyState title="You haven&apos;t booked a creator yet." message="Explore services from talented creators and find the right person for your project." actionLabel="Explore Gigs" onAction={() => { window.location.href = '/discover'; }} />
      ) : visibleBookings.length === 0 ? (
        <EmptyState title={`No ${activeFilter} bookings`} message="Try another status filter to see more of your project requests." />
      ) : (
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '1.25rem' }}>
          <AnimatePresence mode="popLayout">{[...visibleBookings].reverse().map((booking) => <BookingCard key={booking.id} booking={booking} onViewDetails={setSelectedRequirements} />)}</AnimatePresence>
        </motion.div>
      )}

      <Modal isOpen={!!selectedRequirements} onClose={() => setSelectedRequirements(null)} title="Project Requirements" maxWidth="600px">
        <div style={{ padding: '0.25rem 0 1rem' }}><p style={{ color: 'var(--color-ink)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{selectedRequirements}</p></div>
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', textAlign: 'right' }}><button type="button" className="btn-ghost" onClick={() => setSelectedRequirements(null)} style={{ padding: '0.55rem 0.9rem' }}>Close</button></div>
      </Modal>
    </div>
  );
}