import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CalendarDays, CheckCircle2, Edit3, Mail, UserRound } from 'lucide-react';

import { useAuthStore, useBookingStore, useGigStore, useUIStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';

export default function ProfilePage() {
  const { currentUser, isAuthenticated, updateProfile } = useAuthStore();
  const gigs = useGigStore((state) => state.gigs);
  const bookings = useBookingStore((state) => state.bookings);
  const addToast = useUIStore((state) => state.addToast);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [error, setError] = useState('');

  if (!isAuthenticated || !currentUser) {
    return <div className="container-xl section-pad"><EmptyState title="Sign in to view your profile" message="Your profile and booking activity will appear here after you sign in." actionLabel="Go to Sign In" onAction={() => { window.location.href = '/auth'; }} /></div>;
  }

  const creatorProfile = currentUser.role === 'seller' || currentUser.role === 'both';
  const myBookings = bookings.filter((booking) => booking.clientId === currentUser.id);
  const myGigs = gigs.filter((gig) => gig.sellerId === currentUser.id);
  const activeGigs = myGigs.filter((gig) => gig.status !== 'unavailable');
  const creatorBookings = bookings.filter((booking) => booking.creatorId === currentUser.id);
  const creatorBookingCount = creatorBookings.length;
  const acceptedBookings = myBookings.filter((booking) => booking.status === 'accepted').length;
  const pendingBookings = myBookings.filter((booking) => booking.status === 'pending').length;
  const declinedBookings = myBookings.filter((booking) => booking.status === 'declined').length;

  const handleEdit = () => {
    setName(currentUser.name);
    setBio(currentUser.bio || '');
    setError('');
    setIsEditing(true);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError('Please enter a name with at least 2 characters.');
      return;
    }
    if (bio.trim().length > 500) {
      setError('Bio must be 500 characters or fewer.');
      return;
    }
    updateProfile({ name: trimmedName, bio: bio.trim() });
    setIsEditing(false);
    setError('');
    addToast({ type: 'success', title: 'Profile updated successfully.' });
  };

  return (
    <div className="container-xl section-pad" style={{ paddingBottom: '6rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section className="card" style={{ padding: 'clamp(1.25rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: 0 }}>
              {currentUser.avatar ? <img src={currentUser.avatar} alt={currentUser.name} style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)', flexShrink: 0 }} /> : <div style={{ width: '88px', height: '88px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><UserRound size={34} /></div>}
              <div style={{ minWidth: 0 }}>
                <span className="tag" style={{ marginBottom: '0.6rem' }}>{creatorProfile ? 'Creator' : 'Client'}</span>
                <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--color-charcoal)', lineHeight: 1.15, overflowWrap: 'anywhere' }}>{currentUser.name}</h1>
                <p style={{ color: 'var(--color-ink-soft)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem', overflowWrap: 'anywhere' }}><Mail size={15} /> {currentUser.email}</p>
              </div>
            </div>
            <button type="button" className="btn-ghost" onClick={handleEdit} style={{ padding: '0.6rem 0.9rem', fontSize: '0.875rem' }}><Edit3 size={16} /> Edit Profile</button>
          </div>
          <p style={{ color: currentUser.bio ? 'var(--color-ink-soft)' : 'var(--color-ink-muted)', lineHeight: 1.7, maxWidth: '720px', margin: 0 }}>{currentUser.bio || 'Add a short bio so people know what you bring to SkillSwap.'}</p>
        </section>

        {isEditing && <section className="card" style={{ padding: 'clamp(1.25rem, 4vw, 2rem)' }}><form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '680px' }}><div><h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.35rem', color: 'var(--color-charcoal)' }}>Edit Profile</h2><p style={{ color: 'var(--color-ink-soft)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Keep your public profile clear and current.</p></div><label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontWeight: 700, fontSize: '0.875rem' }}>Name<input className="input" aria-label="Name" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} /></label><label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontWeight: 700, fontSize: '0.875rem' }}>Bio<textarea className="input" aria-label="Bio" value={bio} onChange={(event) => setBio(event.target.value)} maxLength={500} rows={5} style={{ resize: 'vertical' }} /></label>{error && <span role="alert" style={{ color: 'var(--color-accent-hover)', fontSize: '0.8125rem' }}>{error}</span>}<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}><button type="submit" className="btn-primary">Save Changes</button><button type="button" className="btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button></div></form></section>}

        <section>
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}><div><span className="tag">Overview</span><h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', color: 'var(--color-charcoal)', marginTop: '0.5rem' }}>{creatorProfile ? 'Creator Profile' : 'Client Profile'}</h2></div>{!creatorProfile && <Link to="/bookings" className="btn-primary" style={{ padding: '0.65rem 1rem', fontSize: '0.875rem' }}>View My Bookings</Link>}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {(creatorProfile ? [{ label: 'Active Gigs', value: activeGigs.length, icon: <Briefcase size={18} /> }, { label: 'Total Bookings', value: creatorBookingCount, icon: <CalendarDays size={18} /> }, { label: 'Accepted', value: creatorBookings.filter((booking) => booking.status === 'accepted').length, icon: <CheckCircle2 size={18} /> }] : [{ label: 'Total Bookings', value: myBookings.length, icon: <CalendarDays size={18} /> }, { label: 'Pending', value: pendingBookings, icon: <CalendarDays size={18} /> }, { label: 'Accepted', value: acceptedBookings, icon: <CheckCircle2 size={18} /> }, { label: 'Declined', value: declinedBookings, icon: <CalendarDays size={18} /> }]).map((stat) => <div key={stat.label} className="card" style={{ padding: '1.25rem' }}><div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-ink-muted)' }}><span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{stat.label}</span>{stat.icon}</div><strong style={{ display: 'block', fontFamily: 'var(--font-family-display)', fontSize: '2rem', color: 'var(--color-charcoal)', marginTop: '0.75rem' }}>{stat.value}</strong></div>)}
          </div>
        </section>

        {creatorProfile && <section><div style={{ marginBottom: '1.25rem' }}><h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', color: 'var(--color-charcoal)' }}>My Services</h2><p style={{ color: 'var(--color-ink-soft)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Services you currently offer on SkillSwap.</p></div>{myGigs.length === 0 ? <EmptyState title="No services yet" message="Create your first service to start receiving project requests." actionLabel="Create a Gig" onAction={() => { window.location.href = '/create-gig'; }} /> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>{myGigs.map((gig) => <Link key={gig.id} to={`/gig/${gig.id}`} className="card" style={{ padding: '1rem', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}><div style={{ height: '130px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--color-cream-dark)' }}>{gig.images[0] && <img src={gig.images[0]} alt={gig.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</div><h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1rem', color: 'var(--color-charcoal)' }}>{gig.title}</h3><div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-ink-soft)', fontSize: '0.8125rem' }}><span>{formatPrice(gig.packages[0]?.price || 0)}</span><span>{gig.status === 'unavailable' ? 'Unavailable' : 'Active'}</span></div><span style={{ color: 'var(--color-accent-hover)', fontSize: '0.8125rem', fontWeight: 700 }}>View service</span></Link>)}</div>}</section>}
      </div>
    </div>
  );
}