// ============================================================
// SKILLSWAP — Navbar
// ============================================================
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User as UserIcon, Bell, CheckCheck } from 'lucide-react';
import { useAuthStore, useNotificationStore, useUIStore } from '@/store';
import type { AppNotification } from '@/types';
import BrandLogo from './BrandLogo';

interface NavItem {
  label: string;
  to: string;
}

const BUYER_LINKS: NavItem[] = [
  { label: 'Discover', to: '/discover' },
  { label: 'My Bookings', to: '/bookings' },
  { label: 'Profile', to: '/profile' },
];

const SELLER_LINKS: NavItem[] = [
  { label: 'Discover', to: '/discover' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Create Gig', to: '/create-gig' },
  { label: 'Profile', to: '/profile' },
];

const DEFAULT_LINKS: NavItem[] = [
  { label: 'Discover', to: '/discover' },
  { label: 'My Bookings', to: '/bookings' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Create Gig', to: '/create-gig' },
];

function getLinks(role?: string): NavItem[] {
  if (role === 'buyer') return BUYER_LINKS;
  if (role === 'seller') return SELLER_LINKS;
  if (role === 'both') return SELLER_LINKS; // seller-priority for 'both'
  return DEFAULT_LINKS;
}

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuthStore();
  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useUIStore();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);
  const allNotifications = useNotificationStore((state) => state.notifications);
  const markRead = useNotificationStore((state) => state.markRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifications = useMemo(
    () => allNotifications.filter((item) => item.userId === currentUser?.id),
    [allNotifications, currentUser?.id],
  );

  const links = getLinks(currentUser?.role);

  // Close drawer on route change / outside click
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileNav();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeMobileNav]);

  function handleLogout() {
    logout();
    closeMobileNav();
    navigate('/');
  }

  const unreadCount = notifications.filter((item) => !item.read).length;
  const openNotification = (notification: AppNotification) => {
    markRead(notification.id);
    setNotificationsOpen(false);
    if (notification.type === 'booking_request') navigate('/dashboard');
    else if (notification.relatedId) navigate(`/gig/${notification.relatedId}`);
    else navigate('/profile');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'nav-link',
      isActive ? 'nav-link-active' : '',
    ].join(' ');

  return (
    <>
      {/* ── Main bar ──────────────────────────────────────────── */}
      <header
        className="site-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(247,244,239,0.94)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <nav
          className="container-xl site-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '68px',
          }}
        >
          {/* Logo */}
          <Link to="/" className="brand-link">
            <BrandLogo />
          </Link>

          {/* Desktop nav links */}
          <div
            className="site-nav-links hidden-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop right actions */}
          <div
            className="site-nav-actions hidden-mobile"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            {isAuthenticated ? (
              <>
                <div className="notification-anchor" style={{ position: 'relative' }}>
                  <button className="icon-btn" type="button" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)} style={{ position: 'relative' }}>
                    <Bell size={18} />
                    {unreadCount > 0 && <span aria-label={`${unreadCount} unread notifications`} style={{ position: 'absolute', top: '-4px', right: '-4px', minWidth: '18px', height: '18px', padding: '0 4px', borderRadius: '999px', backgroundColor: 'var(--color-accent)', color: 'var(--color-charcoal)', fontSize: '0.65rem', fontWeight: 800, display: 'grid', placeItems: 'center' }}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
                  </button>
                  {notificationsOpen && <NotificationPanel notifications={notifications} onSelect={openNotification} onMarkAll={() => currentUser && markAllRead(currentUser.id)} />}
                </div>
                <Link
                  to="/profile"
                  className="nav-profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                  }}
                >
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--color-border)',
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-accent-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <UserIcon size={16} color="var(--color-accent-hover)" />
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--color-ink)',
                    }}
                  >
                    {currentUser?.name?.split(' ')[0]}
                  </span>
                </Link>
                <button
                  className="nav-logout"
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.35rem',
                    color: 'var(--color-ink-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '6px',
                    transition: 'color 0.15s',
                  }}
                  title="Log out"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-ink-soft)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                >
                  Log in
                </Link>
                <Link to="/auth?mode=register" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="show-mobile nav-menu-toggle"
            onClick={toggleMobileNav}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'var(--color-charcoal)',
              display: 'none', // overridden by .show-mobile
              alignItems: 'center',
            }}
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobileNav}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 40,
                backgroundColor: 'rgba(28,31,38,0.4)',
              }}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              ref={drawerRef}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="mobile-nav-drawer"
              style={{
                position: 'fixed',
                top: '68px',
                left: 0,
                right: 0,
                zIndex: 45,
                backgroundColor: 'var(--color-cream)',
                borderBottom: '1px solid var(--color-border)',
                padding: '1.25rem 1.5rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileNav}
                  className={({ isActive }) => `mobile-nav-link${isActive ? ' mobile-nav-link-active' : ''}`}
                  style={({ isActive }) => ({
                    padding: '0.75rem 0',
                    fontFamily: 'var(--font-family-display)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: isActive
                      ? 'var(--color-accent-hover)'
                      : 'var(--color-ink)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--color-border)',
                    transition: 'color 0.15s',
                  })}
                >
                  {link.label}
                </NavLink>
              ))}

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {isAuthenticated ? (
                  <>
                    <button type="button" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)} className="btn-ghost" style={{ width: '100%', justifyContent: 'center', position: 'relative' }}><Bell size={17} /> Notifications{unreadCount > 0 && <span style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-charcoal)', borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>{unreadCount}</span>}</button>
                    {notificationsOpen && <NotificationPanel notifications={notifications} onSelect={openNotification} onMarkAll={() => currentUser && markAllRead(currentUser.id)} mobile />}
                    <Link
                      to="/profile"
                      onClick={closeMobileNav}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        textDecoration: 'none',
                        padding: '0.5rem 0',
                      }}
                    >
                      {currentUser?.avatar && (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      )}
                      <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>
                        {currentUser?.name}
                      </span>
                    </Link>
                    <button onClick={handleLogout} className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={closeMobileNav} className="btn-ghost" style={{ textAlign: 'center', justifyContent: 'center' }}>
                      Log in
                    </Link>
                    <Link to="/auth?mode=register" onClick={closeMobileNav} className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Responsive show/hide styles (injected globally) ───── */}
      <style>{`
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 768px) {
          .show-mobile   { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function NotificationPanel({ notifications, onSelect, onMarkAll, mobile = false }: { notifications: AppNotification[]; onSelect: (notification: AppNotification) => void; onMarkAll: () => void; mobile?: boolean }) {
  const unreadCount = notifications.filter((item) => !item.read).length;
  return <div className="notification-panel" role="dialog" aria-label="Notifications" style={{ position: mobile ? 'static' : 'absolute', top: 'calc(100% + 0.75rem)', right: 0, width: mobile ? '100%' : 'min(360px, calc(100vw - 2rem))', maxHeight: 'min(420px, calc(100vh - 110px))', overflowY: 'auto', zIndex: 70, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card-hover)', padding: '1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}><div><h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1rem', color: 'var(--color-charcoal)' }}>Notifications</h2>{unreadCount > 0 && <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.75rem' }}>{unreadCount} unread</span>}</div>{unreadCount > 0 && <button type="button" onClick={onMarkAll} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', border: 0, background: 'none', color: 'var(--color-accent-hover)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}><CheckCheck size={14} /> Mark all as read</button>}</div>
    {notifications.length === 0 ? <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.875rem', lineHeight: 1.5, margin: '1rem 0 0.5rem' }}>You&apos;re all caught up.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>{notifications.slice(0, 20).map((notification) => <button key={notification.id} type="button" onClick={() => onSelect(notification)} style={{ width: '100%', textAlign: 'left', border: 0, borderRadius: '8px', backgroundColor: notification.read ? 'transparent' : 'var(--color-accent-light)', padding: '0.75rem', cursor: 'pointer' }}><span style={{ display: 'block', color: 'var(--color-charcoal)', fontSize: '0.8125rem', fontWeight: notification.read ? 600 : 800 }}>{notification.title}</span><span style={{ display: 'block', color: 'var(--color-ink-soft)', fontSize: '0.78rem', lineHeight: 1.4, marginTop: '0.2rem' }}>{notification.message}</span><span style={{ display: 'block', color: 'var(--color-ink-muted)', fontSize: '0.68rem', marginTop: '0.35rem' }}>{formatNotificationDate(notification.createdAt)}</span></button>)}</div>}
  </div>;
}

function formatNotificationDate(iso: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
}

