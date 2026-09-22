// ============================================================
// SKILLSWAP — Footer
// ============================================================
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store';
import BrandLogo from './BrandLogo';

const FOOTER_LINKS = {
  categories: [
    { label: 'Design & Creative', to: '/discover?category=design' },
    { label: 'Development & Tech', to: '/discover?category=development' },
    { label: 'Writing & Translation', to: '/discover?category=writing' },
    { label: 'Digital Marketing', to: '/discover?category=marketing' },
    { label: 'Video & Animation', to: '/discover?category=video' },
    { label: 'AI Services', to: '/discover?category=ai-services' },
  ],
};

export default function Footer() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const creatorLinks = currentUser?.role === 'seller' || currentUser?.role === 'both';
  const marketplaceLinks = [
    { label: 'Discover', to: '/discover' },
    ...(creatorLinks ? [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Create Gig', to: '/create-gig' }] : [{ label: 'My Bookings', to: '/bookings' }]),
    { label: 'Profile', to: '/profile' },
  ];

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
            <Link to="/" className="brand-link brand-link-footer" style={{ marginBottom: '1rem' }}>
              <BrandLogo inverted />
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
              Turn your skills into opportunities.
            </p>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <a
                href="mailto:tarunbatshas@gmail.com"
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
                tarunbatshas@gmail.com
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
                Haridwar, Uttarakhand
              </span>
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
              {marketplaceLinks.map((l) => (
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
            © 2026 SkillSwap. All rights reserved.
          </p>
          <span style={{ fontSize: '0.8125rem', color: 'rgba(247,244,239,0.4)' }}>Built for creators and clients.</span>
        </div>
      </div>
    </footer>
  );
}

