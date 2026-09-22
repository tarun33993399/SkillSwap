// ============================================================
// SKILLSWAP — Navbar
// ============================================================
import { useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';

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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'text-sm font-semibold transition-colors duration-150',
      isActive
        ? 'text-[var(--color-accent)]'
        : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]',
    ].join(' ');

  return (
    <>
      {/* ── Main bar ──────────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(247,244,239,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <nav
          className="container-xl"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '68px',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={18} color="var(--color-charcoal)" strokeWidth={2.5} />
            </span>
            <span
              style={{
                fontFamily: 'var(--font-family-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: 'var(--color-charcoal)',
                letterSpacing: '-0.02em',
              }}
            >
              SkillSwap
            </span>
          </Link>

          {/* Desktop nav links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
            }}
            className="hidden-mobile"
          >
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop right actions */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            className="hidden-mobile"
          >
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
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
            className="show-mobile"
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

