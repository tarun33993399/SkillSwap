// ============================================================
// SKILLSWAP — Footer
// ============================================================
import { Link } from 'react-router-dom';
import { Zap, Globe, MessageSquare, AtSign, Video, Mail, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  marketplace: [
    { label: 'Discover Gigs', to: '/discover' },
    { label: 'Create a Gig', to: '/create-gig' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'My Bookings', to: '/bookings' },
  ],
  categories: [
    { label: 'Design & Creative', to: '/discover?category=design' },
    { label: 'Development & Tech', to: '/discover?category=development' },
    { label: 'Writing & Translation', to: '/discover?category=writing' },
    { label: 'Digital Marketing', to: '/discover?category=marketing' },
    { label: 'Video & Animation', to: '/discover?category=video' },
    { label: 'AI Services', to: '/discover?category=ai-services' },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Cookie Policy', to: '/cookies' },
  ],
};

const SOCIAL_LINKS = [
  { icon: MessageSquare, href: '#', label: 'Twitter' },
  { icon: Globe, href: '#', label: 'LinkedIn' },
  { icon: AtSign, href: '#', label: 'GitHub' },
  { icon: Video, href: '#', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-charcoal)', color: 'var(--color-cream)' }}>

      {/* ── Main grid ─────────────────────────────────────────── */}
      <div className="container-xl" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                marginBottom: '1rem',
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
                  flexShrink: 0,
                }}
              >
                <Zap size={18} color="var(--color-charcoal)" strokeWidth={2.5} />
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-family-display)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  color: 'var(--color-cream)',
                  letterSpacing: '-0.02em',
                }}
              >
                SkillSwap
              </span>
            </Link>

            <p
              style={{
                fontSize: '0.875rem',
                color: 'rgba(247,244,239,0.65)',
                lineHeight: 1.7,
                maxWidth: '260px',
                marginBottom: '1.5rem',
              }}
            >
              The creator gig marketplace where skills meet opportunity. Hire talented freelancers or monetise your expertise.
            </p>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <a
                href="mailto:hello@skillswap.io"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  color: 'rgba(247,244,239,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
              >
                <Mail size={14} />
                hello@skillswap.io
              </a>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  color: 'rgba(247,244,239,0.65)',
                }}
              >
                <MapPin size={14} />
                San Francisco, CA
              </span>
            </div>

            {/* Social */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid rgba(247,244,239,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(247,244,239,0.65)',
                    textDecoration: 'none',
                    transition: 'border-color 0.15s, color 0.15s, background-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = 'var(--color-accent)';
                    el.style.color = 'var(--color-accent)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = 'rgba(247,244,239,0.15)';
                    el.style.color = 'rgba(247,244,239,0.65)';
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-family-display)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '1.25rem',
              }}
            >
              Marketplace
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {FOOTER_LINKS.marketplace.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    style={{
                      fontSize: '0.875rem',
                      color: 'rgba(247,244,239,0.65)',
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-cream)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(247,244,239,0.65)'; }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-family-display)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '1.25rem',
              }}
            >
              Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {FOOTER_LINKS.categories.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    style={{
                      fontSize: '0.875rem',
                      color: 'rgba(247,244,239,0.65)',
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-cream)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(247,244,239,0.65)'; }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────── */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(247,244,239,0.1)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: 'rgba(247,244,239,0.4)', margin: 0 }}>
            © {new Date().getFullYear()} SkillSwap, Inc. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {FOOTER_LINKS.legal.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  fontSize: '0.8125rem',
                  color: 'rgba(247,244,239,0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(247,244,239,0.7)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(247,244,239,0.4)'; }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

