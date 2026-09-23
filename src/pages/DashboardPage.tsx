// ============================================================
// SKILLSWAP — Creator Dashboard
// ============================================================
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  CalendarClock,
  Plus,
  Briefcase,
  Inbox,
  CheckCircle,
  BarChart,
  Edit3,
  Calendar,
  ToggleRight,
  ToggleLeft
} from 'lucide-react';

import type { Booking } from '@/types';
import { GigsAPI } from '@/lib/api'; 
import { useAuthStore, useBookingStore, useUIStore, useGigStore, useNotificationStore } from '@/store';
import { formatDate, formatPrice } from '@/lib/utils';
import { CATEGORIES } from '@/data/seed';

import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuthStore();
  const { forCreator, updateStatus } = useBookingStore();
  const { addToast } = useUIStore();
  const addNotification = useNotificationStore((state) => state.add);
  const { gigs: allGigs, updateGig } = useGigStore();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState<string | null>(null);

  // Guard: redirect buyers
  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'buyer') {
      navigate('/discover');
    }
    setIsLoading(false);
  }, [currentUser, isAuthenticated, navigate]);

  if (!isAuthenticated || !currentUser) {
    return <div className="container-xl section-pad"><EmptyState title="Sign in to view your dashboard" message="Creator tools and booking requests are available after you sign in." actionLabel="Go to Sign In" onAction={() => navigate('/auth')} /></div>;
  }
  if (currentUser.role === 'buyer') {
    return <div className="container-xl section-pad"><EmptyState title="Creators only" message="The dashboard is for managing services and booking requests." actionLabel="Explore Gigs" onAction={() => navigate('/discover')} /></div>;
  }

  // Filter gigs to only this creator's
  const creatorGigs = allGigs.filter(g => g.sellerId === currentUser.id);
  const bookings = forCreator(currentUser.id);

  // Compute live stats
  const activeGigsCount = creatorGigs.filter(g => g.status !== 'unavailable').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const acceptedCount = bookings.filter(b => b.status === 'accepted').length;
  const totalBookings = bookings.length;

  // ── Actions ──
  const handleAccept = (booking: Booking) => {
    const gig = allGigs.find((item) => item.id === booking.gigId);
    const competingPending = bookings.filter((item) => item.gigId === booking.gigId && item.status === 'pending' && item.id !== booking.id);
    if (!gig || gig.status === 'unavailable' || bookings.some((item) => item.gigId === booking.gigId && item.status === 'accepted')) {
      addToast({ type: 'error', title: 'This service is no longer available.' });
      return;
    }

    const gigRes = GigsAPI.update(booking.gigId, { status: 'unavailable' });
    if (!gigRes.ok) {
      addToast({ type: 'error', title: 'Unable to update service availability.', message: gigRes.error.message });
      return;
    }

    updateGig(gigRes.data);
    updateStatus(booking.id, 'accepted');
    competingPending.forEach((pendingBooking) => {
      updateStatus(pendingBooking.id, 'declined');
      addNotification({
        userId: pendingBooking.clientId,
        type: 'booking_declined',
        title: 'Booking update',
        message: 'This service was booked by another client.',
        relatedId: pendingBooking.gigId,
      });
    });
    addNotification({
      userId: booking.clientId,
      type: 'booking_accepted',
      title: 'Booking accepted',
      message: `Your booking for ${gigRes.data.title} was accepted by the creator.`,
      relatedId: booking.gigId,
    });
    addToast({ type: 'success', title: 'Booking accepted successfully.' });
  };

  const handleDecline = (booking: Booking) => {
    const bookingId = booking.id;
    updateStatus(bookingId, 'declined');
    if (booking) {
      addNotification({
        userId: booking.clientId,
        type: 'booking_declined',
        title: 'Booking update',
        message: 'The creator is not available for this request.',
        relatedId: booking.gigId,
      });
    }
    addToast({ type: 'success', title: 'Booking declined.' });
  };

  const handleToggleGigStatus = (gigId: string, currentStatus?: string) => {
    const newStatus = currentStatus === 'unavailable' ? 'active' : 'unavailable';
    const res = GigsAPI.update(gigId, { status: newStatus });
    if (res.ok) {
      updateGig(res.data);
    }
  };

  if (isLoading) {
    return <div className="container-xl section-pad"><div style={{ height: '400px' }} /></div>;
  }

  return (
    <div className="container-xl section-pad" style={{ paddingBottom: '6rem' }}>
      
      {/* ── 1. Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        <style>{`
          .dashboard-header { display: flex; flex-direction: column; gap: 1.5rem; }
          @media (min-width: 768px) {
            .dashboard-header { flex-direction: row; align-items: flex-start; justify-content: space-between; }
          }
        `}</style>
        <div className="dashboard-header">
          <div>
            <h1 style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--color-charcoal)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Creator Dashboard
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--color-ink-soft)', maxWidth: '600px', lineHeight: 1.6 }}>
              Manage your services, review project requests, and keep your creator profile active.
            </p>
          </div>
          <Link to="/create-gig" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <Plus size={18} /> Create New Gig
          </Link>
        </div>
      </div>

      {/* ── 2. Live Statistics ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {[
          { label: 'Active Gigs', value: activeGigsCount, icon: <Briefcase size={20} /> },
          { label: 'Pending Requests', value: pendingCount, icon: <Inbox size={20} /> },
          { label: 'Accepted Bookings', value: acceptedCount, icon: <CheckCircle size={20} /> },
          { label: 'Total Bookings', value: totalBookings, icon: <BarChart size={20} /> },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ 
              padding: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-ink-muted)' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{stat.label}</span>
              {stat.icon}
            </div>
            <span style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-charcoal)', lineHeight: 1 }}>
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        <style>{`
          .dashboard-grid { display: flex; flex-direction: column; gap: 4rem; }
          @media (min-width: 1024px) {
            .dashboard-grid { grid-template-columns: 1fr; } /* Decided to stack for more breathing room, per SaaS look */
          }
        `}</style>
        
        {/* ── 3. Incoming Bookings ── */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', marginBottom: '1.5rem' }}>
            Incoming Booking Requests
          </h2>
          
          {bookings.length === 0 ? (
            <EmptyState
              title="You're all caught up"
              message="You don't have any incoming booking requests right now. Keep your gigs active and share your profile to attract more clients."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AnimatePresence>
                {[...bookings].reverse().map(booking => {
                  const gig = creatorGigs.find(g => g.id === booking.gigId);
                  // Generate an avatar based on client name if missing
                  const clientAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.clientName)}&background=F7F4EF&color=1C1F26`;
                  
                  return (
                    <motion.div
                      key={booking.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        padding: '1.5rem', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1.25rem',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-card)',
                      }}
                    >
                      {/* Top row: Client info & Status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                        
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <img src={clientAvatar} alt={booking.clientName} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--color-border)' }} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                              <h4 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                                {booking.clientName}
                              </h4>
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-ink-soft)' }}>
                              {booking.clientEmail}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                          <StatusBadge status={booking.status} />
                          <span style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CalendarClock size={14} /> {formatDate(booking.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Request Details Block */}
                      <div style={{ backgroundColor: 'var(--color-cream-dark)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-ink-muted)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Service</span>
                            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>{gig?.title || 'Unknown Gig'}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-ink-muted)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Rate</span>
                            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>{formatPrice(booking.rate)}</span>
                          </div>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-ink-muted)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Requirements</span>
                          <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink)', lineHeight: 1.5, margin: 0 }}>
                            {booking.requirements.length > 90 ? (
                              <>
                                "{booking.requirements.substring(0, 90)}..."{' '}
                                <button onClick={() => setSelectedReq(booking.requirements)} style={{ background: 'none', border: 'none', color: 'var(--color-accent-hover)', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                                  View Details
                                </button>
                              </>
                            ) : (
                              `"${booking.requirements}"`
                            )}
                          </p>
                        </div>
                      </div>

                      {/* ── 4 & 5. Actions ── */}
                      {booking.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                          <button
                            className="btn-primary"
                            onClick={() => handleAccept(booking)}
                            style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}
                          >
                            <Check size={16} /> Accept
                          </button>
                          <button
                            className="btn-ghost"
                            onClick={() => handleDecline(booking)}
                            style={{ padding: '0.625rem 1.25rem', color: 'var(--color-ink-soft)', fontSize: '0.875rem' }}
                          >
                            <X size={16} /> Decline
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── 7. My Services ── */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', marginBottom: '1.5rem' }}>
            My Services
          </h2>
          
          {creatorGigs.length === 0 ? (
            <EmptyState
              title="Start offering your skills"
              message="Create your first service and start receiving project requests."
              actionLabel="Create Your First Gig"
              onAction={() => navigate('/create-gig')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <style>{`
                .service-row { flex-direction: column; gap: 1rem; }
                @media(min-width: 768px) {
                  .service-row { flex-direction: row; align-items: center; justify-content: space-between; }
                }
              `}</style>

              {creatorGigs.map(gig => {
                const isUnavailable = gig.status === 'unavailable';
                const cat = CATEGORIES.find(c => c.id === gig.categoryId);
                
                return (
                  <div key={gig.id} className="service-row" style={{ 
                    padding: '1.25rem 1.5rem', 
                    display: 'flex', 
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-card)',
                  }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--color-cream-dark)', flexShrink: 0 }}>
                        {gig.images[0] && <img src={gig.images[0]} alt={gig.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '0.25rem' }}>
                          {gig.title}
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--color-ink-soft)' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>{formatPrice(gig.packages[0]?.price || 0)}</span>
                          <span>•</span>
                          <span>{cat?.name}</span>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> {formatDate(gig.updatedAt || gig.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                      {/* 8. Availability Control */}
                      <button
                        onClick={() => handleToggleGigStatus(gig.id, gig.status)}
                        style={{
                          background: 'none',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: isUnavailable ? 'var(--color-ink-muted)' : 'var(--color-accent)'
                        }}
                        aria-label={`Toggle availability. Currently ${isUnavailable ? 'unavailable' : 'active'}`}
                      >
                        {isUnavailable ? <ToggleLeft size={24} color="var(--color-ink-muted)" /> : <ToggleRight size={24} color="var(--color-accent)" />}
                        {isUnavailable ? 'Unavailable' : 'Active'}
                      </button>

                      <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }}></div>

                      <button
                        className="btn-ghost"
                        onClick={() => navigate(`/edit-gig/${gig.id}`)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem', color: 'var(--color-ink-soft)' }}
                        aria-label="Edit service"
                      >
                        <Edit3 size={16} /> Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Requirement Details Modal */}
      <Modal isOpen={!!selectedReq} onClose={() => setSelectedReq(null)} title="Project Requirements" maxWidth="600px">
        <div style={{ padding: '1.5rem 0' }}>
          <p style={{ fontSize: '1rem', color: 'var(--color-ink)', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
            {selectedReq}
          </p>
        </div>
        <div style={{ textAlign: 'right', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
          <button className="btn-ghost" onClick={() => setSelectedReq(null)}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

