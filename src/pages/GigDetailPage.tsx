// ============================================================
// SKILLSWAP — Gig Detail Page + Booking Flow
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
  Calendar,
  Check
} from 'lucide-react';

import type { User } from '@/types';
import { UsersAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { CATEGORIES } from '@/data/seed';
import { useAuthStore, useBookingStore, useUIStore, useGigStore } from '@/store';

import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import GigCard from '@/components/gigs/GigCard';

// ── Creator Mini Profile Component ─────────────────────────────
function CreatorMiniProfile({ creator }: { creator: User }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
      <img
        src={creator.avatar}
        alt={creator.name}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid var(--color-border)'
        }}
      />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-charcoal)' }}>
            {creator.name}
          </span>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', padding: '0.125rem 0.5rem', borderRadius: '999px' }}>
            Creator
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-soft)', marginTop: '0.125rem' }}>
          {(creator.bio || '').length > 80 ? (creator.bio || '').substring(0, 80) + '...' : (creator.bio || '')}
        </p>
      </div>
    </div>
  );
}

export default function GigDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { currentUser } = useAuthStore();
  const { add: addBooking, forClient } = useBookingStore();
  const { addToast } = useUIStore();

  // Read gigs directly from gigStore — reactive to status changes (unavailable)
  const allGigs = useGigStore((s) => s.gigs);
  const gig = allGigs.find((g) => g.id === id) ?? null;
  const [creator, setCreator] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form & Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    clientName: currentUser?.name || '',
    clientEmail: currentUser?.email || '',
    requirements: '',
    deadline: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const clientBookings = forClient(currentUser?.id || 'guest');
  // Duplicate Protection: same client + same gig + same creator + pending
  const hasDuplicatePending = clientBookings.some(
    b => b.gigId === id && b.creatorId === gig?.sellerId && b.status === 'pending'
  );

  // Load creator data when gig resolves in the store
  useEffect(() => {
    if (!gig) {
      const t = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(t);
    }
    setIsLoading(false);
    const userRes = UsersAPI.getById(gig.sellerId);
    if (userRes.ok) setCreator(userRes.data);
  }, [gig]);

  // Handle ?action=book
  useEffect(() => {
    if (searchParams.get('action') === 'book' && gig) {
      if (gig.status !== 'unavailable') {
        setIsModalOpen(true);
      }
      setSearchParams(new URLSearchParams(), { replace: true });
    }
  }, [searchParams, gig, setSearchParams]);

  const handleValidation = () => {
    const errors: Record<string, string> = {};
    if (!formData.clientName.trim()) {
      errors.clientName = 'Please enter your name.';
    }
    if (!formData.clientEmail.trim()) {
      errors.clientEmail = 'Please enter a valid email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      errors.clientEmail = 'Please enter a valid email address.';
    }
    if (formData.requirements.trim().length < 10) {
      errors.requirements = 'Please describe what you need from the creator.';
    }
    
    // Future date validation
    if (formData.deadline) {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        errors.deadline = 'Please choose a future deadline.';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation() || !gig || !creator) return;

    // Race condition check: make sure gig wasn't made unavailable while modal was open
    if (gig.status === 'unavailable') {
      return; // Will be handled by the UI showing the unavailable state
    }
    
    if (hasDuplicatePending) {
      return;
    }

    setIsSubmitting(true);
    submitTimerRef.current = setTimeout(() => {
      addBooking({
        gigId: gig.id,
        creatorId: creator.id,
        clientId: currentUser?.id || 'guest',
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        requirements: formData.requirements,
        deadline: formData.deadline || undefined,
        rate: gig.packages[0]?.price || 0,
        status: 'pending'
      });
      
      setIsSubmitting(false);
      setBookingStep('success');
      addToast({ type: 'success', title: 'Booking request sent successfully.' });
      submitTimerRef.current = null;
    }, 600);
  };


  const handleCloseModal = () => {
    if (submitTimerRef.current) {
      clearTimeout(submitTimerRef.current);
      submitTimerRef.current = null;
      setIsSubmitting(false);
    }
    setIsModalOpen(false);
    setTimeout(() => setBookingStep('form'), 300);
  };

  if (isLoading) {
    return (
      <div className="container-xl section-pad">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ height: '30px', width: '40%', backgroundColor: 'var(--color-cream-dark)', borderRadius: '4px', marginBottom: '1rem' }} />
          <div style={{ height: '400px', width: '100%', backgroundColor: 'var(--color-cream-dark)', borderRadius: 'var(--radius-card)', marginBottom: '2rem' }} />
        </div>
      </div>
    );
  }

  if (!gig || !creator) {
    return (
      <div className="container-xl section-pad">
        <EmptyState
          title="Service Not Found"
          message="This service may have been removed or is no longer available."
          actionLabel="Browse Services"
          onAction={() => navigate('/discover')}
        />
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === gig.categoryId);
  const basePrice = gig.packages[0]?.price || 0;
  const isUnavailable = gig.status === 'unavailable';
  
  // Related Gigs Logic (Category match, exclude current, prefer active)
  const relatedGigs = allGigs
    .filter(g => g.id !== gig.id)
    .sort((a, b) => {
      // 1. Same category gets priority
      const aCat = a.categoryId === gig.categoryId ? 1 : 0;
      const bCat = b.categoryId === gig.categoryId ? 1 : 0;
      if (aCat !== bCat) return bCat - aCat;
      // 2. Active status gets priority
      const aAct = a.status === 'active' ? 1 : 0;
      const bAct = b.status === 'active' ? 1 : 0;
      return bAct - aAct;
    })
    .slice(0, 3);

  return (
    <div className="container-xl section-pad" style={{ paddingBottom: '6rem' }}>
      
      {/* ── Responsive CSS via styled media query ── */}
      <style>{`
        .gig-detail-grid { display: flex; flex-direction: column; gap: 3rem; }
        .gig-detail-left { flex: 1; min-width: 0; }
        .gig-detail-right { width: 100%; }
        
        @media(min-width: 1024px) {
          .gig-detail-grid { flex-direction: row; align-items: flex-start; gap: 4rem; }
          .gig-detail-right { width: 380px; flex-shrink: 0; position: sticky; top: 120px; }
        }
        
        .breadcrumb-link:hover { color: var(--color-accent-hover); }
      `}</style>

      {/* ── 2. Breadcrumb ── */}
      <nav style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-ink-muted)', marginBottom: '2.5rem' }}>
        <Link to="/" className="breadcrumb-link" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/discover" className="breadcrumb-link" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Discover</Link>
        <ChevronRight size={14} />
        {category && (
          <>
            <Link to={`/discover?category=${category.slug}`} className="breadcrumb-link" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>{category.name}</Link>
            <ChevronRight size={14} />
          </>
        )}
        <span style={{ color: 'var(--color-charcoal)', fontWeight: 600 }}>{gig.title}</span>
      </nav>

      {/* ── Layout Grid ── */}
      <div className="gig-detail-grid">
        
        {/* ── Left Column ── */}
        <div className="gig-detail-left">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* 3. Gig Header */}
            {category && (
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent-hover)', marginBottom: '1rem' }}>
                {category.name}
              </div>
            )}
            
            <h1 style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-charcoal)', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              {gig.title}
            </h1>

            {/* 4. Creator Mini Profile */}
            <CreatorMiniProfile creator={creator} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
            {/* Hero Image */}
            <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', marginTop: '2.5rem', marginBottom: '3rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream-dark)' }}>
              {gig.images[0] && (
                <img src={gig.images[0]} alt={gig.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }} />
              )}
            </div>

            {/* 7. Service Information Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', marginBottom: '3rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-ink-muted)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
                  <Tag size={16} /> Starting Price
                </div>
                <div style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                  {formatPrice(basePrice)}
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-ink-muted)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
                  <Clock size={16} /> Delivery Time
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                  {gig.packages[0]?.deliveryDays || 0} Days
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-ink-muted)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
                  <Calendar size={16} /> Availability
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: isUnavailable ? 'var(--color-ink-soft)' : '#16a34a' }}>
                  {isUnavailable ? 'Unavailable' : 'Taking Bookings'}
                </div>
              </div>
            </div>

            {/* 5. Description */}
            <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', marginBottom: '1.25rem' }}>
              About This Service
            </h2>
            <div style={{ fontSize: '1.0625rem', lineHeight: 1.75, color: 'var(--color-ink-soft)', whiteSpace: 'pre-wrap', marginBottom: '3.5rem' }}>
              {gig.description}
            </div>

            {/* 6. Package / Features */}
            {gig.packages && gig.packages.length > 0 && gig.packages[0].features && gig.packages[0].features.length > 0 && (
              <div style={{ marginBottom: '3.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', marginBottom: '1.5rem' }}>
                  What's Included
                </h2>
                <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', padding: 0, margin: 0, listStyle: 'none' }}>
                  {gig.packages[0].features.map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '1rem', color: 'var(--color-ink)' }}>
                      <Check size={20} style={{ color: 'var(--color-accent-hover)', flexShrink: 0, marginTop: '0.125rem' }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <hr className="divider" style={{ margin: '3.5rem 0' }} />

            {/* 10. Creator Section */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', marginBottom: '2rem' }}>
                About the Creator
              </h2>
              <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <img src={creator.avatar} alt={creator.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }} />
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-charcoal)' }}>
                      {creator.name}
                    </h3>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-soft)', marginBottom: '0.25rem' }}>
                      {category?.name || 'Professional Creator'}
                    </p>
                    {creator.isVerified && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-accent-hover)' }}>
                        <ShieldCheck size={14} /> Verified Member
                      </div>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-ink-soft)', margin: 0 }}>
                  {creator.bio}
                </p>
                <div style={{ marginTop: '0.5rem' }}>
                  <Link to="/discover" className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                    View More Services
                  </Link>
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>

        {/* ── Right Column ── */}
        <div className="gig-detail-right">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            
            {/* 8. Sticky Service Card */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Starting At
                </p>
                <div style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-charcoal)', lineHeight: 1 }}>
                  {formatPrice(basePrice)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', color: 'var(--color-ink-soft)' }}>
                  <span>Delivery</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>{gig.packages[0]?.deliveryDays || 0} Days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', color: 'var(--color-ink-soft)' }}>
                  <span>Revisions</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>{gig.packages[0]?.revisions || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', color: 'var(--color-ink-soft)' }}>
                  <span>Status</span>
                  <span style={{ fontWeight: 700, color: isUnavailable ? 'var(--color-ink-muted)' : '#16a34a' }}>
                    {isUnavailable ? 'Unavailable' : 'Available'}
                  </span>
                </div>
              </div>

              {/* 9. Unavailable State */}
              <div style={{ marginTop: '1rem' }}>
                {isUnavailable ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--color-cream-dark)', borderRadius: 'var(--radius-btn)', textAlign: 'center', fontSize: '1rem', fontWeight: 700, color: 'var(--color-ink-muted)', border: '1px solid var(--color-border)' }}>
                      Currently Unavailable
                    </div>
                    <Link to={`/discover?category=${category?.slug || ''}`} className="btn-primary" style={{ justifyContent: 'center' }}>
                      Browse Similar Gigs
                    </Link>
                  </div>
                ) : (
                  <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.0625rem' }}>
                    Book This Gig
                  </button>
                )}
              </div>
              
              <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)', textAlign: 'center', margin: 0 }}>
                You won't be charged yet.
              </p>
            </div>
            
          </motion.div>
        </div>

      </div>

      {/* ── 11. Related Services ── */}
      {relatedGigs.length > 0 && (
        <div style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid var(--color-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-charcoal)', marginBottom: '2.5rem' }}>
            You May Also Like
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {relatedGigs.map(relatedGig => (
              <GigCard key={relatedGig.id} gig={relatedGig} showBook={true} />
            ))}
          </div>
        </div>
      )}

      {/* ── 12. Back to Discover ── */}
      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <Link to="/discover" className="btn-ghost" style={{ fontSize: '0.9375rem' }}>
          <ArrowLeft size={16} /> Back to Discover
        </Link>
      </div>

      {/* ── Booking Modal Flow (Existing Logic) ── */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={bookingStep === 'form' ? 'Booking Request' : ''}>
        {bookingStep === 'form' ? (
          <form onSubmit={handleBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* 2. BOOKING SUMMARY */}
            <div style={{ backgroundColor: 'var(--color-cream-dark)', padding: '1rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-ink-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>You're booking</p>
              <div style={{ fontFamily: 'var(--font-family-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>{gig.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--color-ink-soft)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><strong style={{ color: 'var(--color-charcoal)' }}>Creator:</strong> {creator.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><strong style={{ color: 'var(--color-charcoal)' }}>Category:</strong> {category?.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><strong style={{ color: 'var(--color-charcoal)' }}>Starting price:</strong> {formatPrice(basePrice)}</span>
              </div>
            </div>

            {/* RACE CONDITION UNAVAILABLE */}
            {isUnavailable && (
              <div style={{ backgroundColor: 'var(--color-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.75rem' }}>
                  This service is no longer accepting bookings.
                </p>
                <Link to={`/discover?category=${category?.slug || ''}`} className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }} onClick={() => setIsModalOpen(false)}>
                  Browse Similar Gigs
                </Link>
              </div>
            )}

            {/* DUPLICATE PENDING CHECK */}
            {hasDuplicatePending && !isUnavailable && (
              <div style={{ backgroundColor: 'rgba(232, 160, 32, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(232, 160, 32, 0.3)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <AlertCircle size={16} style={{ color: 'var(--color-accent-hover)', flexShrink: 0, marginTop: '0.125rem' }} />
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-charcoal)', margin: 0, lineHeight: 1.5 }}>
                  You already have a pending request for this service.
                </p>
              </div>
            )}

            {!isUnavailable && !hasDuplicatePending && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.375rem' }}>Full Name <span style={{ color: 'red' }}>*</span></label>
                  <input className="input" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} onBlur={() => handleValidation()} style={{ borderColor: formErrors.clientName ? 'red' : undefined }} />
                  {formErrors.clientName && <span style={{ fontSize: '0.75rem', color: 'red', marginTop: '0.25rem', display: 'block' }}>{formErrors.clientName}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.375rem' }}>Email <span style={{ color: 'red' }}>*</span></label>
                  <input className="input" type="email" value={formData.clientEmail} onChange={e => setFormData({ ...formData, clientEmail: e.target.value })} onBlur={() => handleValidation()} style={{ borderColor: formErrors.clientEmail ? 'red' : undefined }} />
                  {formErrors.clientEmail && <span style={{ fontSize: '0.75rem', color: 'red', marginTop: '0.25rem', display: 'block' }}>{formErrors.clientEmail}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.375rem' }}>Project Requirements <span style={{ color: 'red' }}>*</span></label>
                  <textarea className="input" rows={4} placeholder="Tell the creator what you need, your goals, preferred style, references, or important details..." value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} onBlur={() => handleValidation()} style={{ borderColor: formErrors.requirements ? 'red' : undefined, resize: 'vertical' }} />
                  {formErrors.requirements && <span style={{ fontSize: '0.75rem', color: 'red', marginTop: '0.25rem', display: 'block' }}>{formErrors.requirements}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.375rem' }}>Deadline (Optional)</label>
                  <input className="input" type="date" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} onBlur={() => handleValidation()} style={{ borderColor: formErrors.deadline ? 'red' : undefined }} />
                  {formErrors.deadline && <span style={{ fontSize: '0.75rem', color: 'red', marginTop: '0.25rem', display: 'block' }}>{formErrors.deadline}</span>}
                </div>

                <div style={{ marginTop: '0.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer', minWidth: '180px', justifyContent: 'center' }}>
                    {isSubmitting ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'flex' }}><Loader2 size={16} /></motion.div> Sending...</>
                    ) : 'Submit Booking'}
                  </button>
                </div>
              </>
            )}
          </form>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '1rem 0 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>
                Booking Request Sent
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-soft)', lineHeight: 1.6, margin: 0 }}>
                Your request has been sent to the creator. You'll see updates here as the creator responds.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', padding: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.875rem' }}>Status</span>
                <span style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', padding: '0.125rem 0.625rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Pending
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.875rem' }}>Service</span>
                <span style={{ color: 'var(--color-charcoal)', fontSize: '0.875rem', fontWeight: 600, textAlign: 'right' }}>{gig.title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.875rem' }}>Creator</span>
                <span style={{ color: 'var(--color-charcoal)', fontSize: '0.875rem', fontWeight: 600 }}>{creator.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.875rem' }}>Rate</span>
                <span style={{ color: 'var(--color-charcoal)', fontSize: '0.875rem', fontWeight: 600 }}>{formatPrice(basePrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.875rem' }}>Request date</span>
                <span style={{ color: 'var(--color-charcoal)', fontSize: '0.875rem', fontWeight: 600 }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn-primary" onClick={() => { setIsModalOpen(false); navigate('/bookings'); }} style={{ width: '100%', justifyContent: 'center' }}>
                View My Bookings
              </button>
              <button className="btn-ghost" onClick={() => { setIsModalOpen(false); navigate('/discover'); }} style={{ width: '100%', justifyContent: 'center' }}>
                Continue Exploring
              </button>
            </div>
          </motion.div>
        )}
      </Modal>
    </div>
  );
}
