// ============================================================
// SKILLSWAP — HomePage
// ============================================================
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Search,
  Palette,
  Code2,
  PenLine,
  TrendingUp,
  Video,
  Music,
  Briefcase,
  Cpu,
  CheckCircle2,
  Users,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import GigCard from '@/components/gigs/GigCard';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { CATEGORIES } from '@/data/seed';
import { useGigStore } from '@/store';

// ── Icon map for categories ───────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  Palette:    <Palette size={26} />,
  Code2:      <Code2 size={26} />,
  PenLine:    <PenLine size={26} />,
  TrendingUp: <TrendingUp size={26} />,
  Video:      <Video size={26} />,
  Music:      <Music size={26} />,
  Briefcase:  <Briefcase size={26} />,
  Cpu:        <Cpu size={26} />,
};

// ── How it works steps ────────────────────────────────────────
const HOW_STEPS = [
  {
    number: '01',
    icon: <Search size={28} />,
    title: 'Discover',
    desc: 'Browse thousands of gigs across 8+ categories. Filter by budget, delivery time, and rating.',
  },
  {
    number: '02',
    icon: <CheckCircle2 size={28} />,
    title: 'Book',
    desc: 'Choose a package that fits your needs, share your requirements, and confirm your booking instantly.',
  },
  {
    number: '03',
    icon: <Users size={28} />,
    title: 'Collaborate',
    desc: 'Work directly with your creator, review deliverables, and get results that exceed expectations.',
  },
];

// ── Testimonials ──────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: 'SkillSwap transformed how we source creative talent. We found our lead designer here in under 24 hours and the results blew us away.',
    name: 'Sarah K.',
    title: 'Founder, Lumio Studio',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    rating: 5,
  },
  {
    quote: 'As a freelance developer, SkillSwap gives me a steady stream of quality clients. The booking flow is dead simple for everyone.',
    name: 'Marcus T.',
    title: 'Full-Stack Engineer',
    avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
    rating: 5,
  },
  {
    quote: 'I\'ve tried Fiverr and Upwork. SkillSwap has the best creator quality and the UI actually makes sense. No noise, just results.',
    name: 'Anika R.',
    title: 'Marketing Director, Fieldstone',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    rating: 5,
  },
];

// ── Client logos (placeholders) ───────────────────────────────
const CLIENT_LOGOS = [
  { name: 'Horizon', style: { fontWeight: 800, letterSpacing: '-0.04em', fontSize: '1.25rem' } },
  { name: 'SkillSwap', style: { fontWeight: 900, fontSize: '1.5rem', letterSpacing: '0.05em' } },
  { name: 'Fieldstone', style: { fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' } },
  { name: 'Kobi & Mike', style: { fontWeight: 600, fontSize: '0.95rem' } },
  { name: 'Nova Labs', style: { fontWeight: 800, letterSpacing: '-0.03em', fontSize: '1.2rem' } },
];

// ── Reusable scroll-reveal section wrapper ────────────────────
function RevealSection({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const reveal = useScrollReveal({ delay });
  return (
    <motion.div {...reveal} style={style}>
      {children}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// HOMEPAGE
// ════════════════════════════════════════════════════════════
export default function HomePage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const allGigs = useGigStore((s) => s.gigs);
  const featuredGigs = allGigs.slice(0, 4);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/discover');
    }
  }

  return (
    <div>
      {/* ══════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'var(--color-charcoal)',
        }}
      >
        {/* Background image with overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.18,
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(28,31,38,0.96) 0%, rgba(28,31,38,0.75) 60%, rgba(28,31,38,0.55) 100%)',
          }}
        />

        {/* Decorative accent blob */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,160,32,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container-xl" style={{ position: 'relative', zIndex: 1, paddingTop: '4rem', paddingBottom: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: '720px' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(232,160,32,0.15)',
                border: '1px solid rgba(232,160,32,0.3)',
                borderRadius: '999px',
                padding: '0.375rem 1rem',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'inline-block' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-accent)', fontFamily: 'var(--font-family-display)' }}>
                The Creator Gig Marketplace
              </span>
            </motion.div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-family-display)',
                fontWeight: 800,
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: 'var(--color-cream)',
                marginBottom: '1.25rem',
              }}
            >
              Turn Your Skills
              <br />
              <span style={{ color: 'var(--color-accent)' }}>Into Opportunities</span>
            </h1>

            {/* Subline */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.1875rem)',
                color: 'rgba(247,244,239,0.75)',
                lineHeight: 1.65,
                marginBottom: '2.5rem',
                maxWidth: '540px',
              }}
            >
              Discover talented creators, book creative services, and turn ideas into real projects — all in one place.
            </p>

            {/* Search bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '2rem',
                maxWidth: '520px',
              }}
            >
              <div style={{ flex: 1, position: 'relative' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(247,244,239,0.4)',
                  }}
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder='Try "logo design" or "React developer"…'
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 2.75rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'rgba(247,244,239,0.1)',
                    border: '1.5px solid rgba(247,244,239,0.18)',
                    color: 'var(--color-cream)',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    backdropFilter: 'blur(8px)',
                    transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(232,160,32,0.6)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(247,244,239,0.18)'; }}
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ flexShrink: 0, padding: '0.875rem 1.5rem' }}
              >
                Search
              </button>
            </motion.form>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}
            >
              <Link to="/discover" className="btn-primary">
                Explore Gigs <ArrowRight size={16} />
              </Link>
              <Link to="/create-gig" className="btn-ghost btn-ghost-light">
                Start Selling
              </Link>
            </motion.div>

            {/* Social proof numbers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem',
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(247,244,239,0.1)',
              }}
            >
              {[
                { value: '2,400+', label: 'Active Gigs' },
                { value: '800+', label: 'Verified Creators' },
                { value: '4.9★', label: 'Avg. Rating' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-cream)', letterSpacing: '-0.02em' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'rgba(247,244,239,0.5)' }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. FEATURED CATEGORIES
      ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--color-cream)', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-xl">
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent-hover)', marginBottom: '0.5rem' }}>
                Explore by Category
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-family-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  letterSpacing: '-0.025em',
                  color: 'var(--color-charcoal)',
                }}
              >
                Whatever You Need, We Have It
              </h2>
            </div>
          </RevealSection>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
            }}
          >
            {CATEGORIES.map((cat, i) => (
              <RevealSection key={cat.id} delay={i * 0.05}>
                <Link
                  to={`/discover?category=${cat.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <motion.div
                    whileHover={{ y: -4, borderColor: 'var(--color-accent)' }}
                    transition={{ duration: 0.2 }}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1.5px solid var(--color-border)',
                      borderRadius: 'var(--radius-card)',
                      padding: '1.375rem 1rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-card)',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        backgroundColor: 'var(--color-accent-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.875rem',
                        color: 'var(--color-accent-hover)',
                      }}
                    >
                      {ICON_MAP[cat.icon] || <Palette size={26} />}
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-family-display)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        color: 'var(--color-charcoal)',
                        lineHeight: 1.3,
                      }}
                    >
                      {cat.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-ink-muted)',
                        marginTop: '0.375rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {cat.description.split('.')[0]}
                    </p>
                  </motion.div>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. FEATURED GIGS
      ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--color-cream-dark)', paddingTop: '5rem', paddingBottom: '5.5rem' }}>
        <div className="container-xl">
          <RevealSection>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent-hover)', marginBottom: '0.5rem' }}>
                  Hand-picked
                </p>
                <h2
                  style={{
                    fontFamily: 'var(--font-family-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                    letterSpacing: '-0.025em',
                    color: 'var(--color-charcoal)',
                  }}
                >
                  Featured Gigs
                </h2>
              </div>
              <Link
                to="/discover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--color-accent-hover)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-family-display)',
                  transition: 'gap 0.15s',
                }}
              >
                Browse all <ArrowRight size={16} />
              </Link>
            </div>
          </RevealSection>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {featuredGigs.map((gig, i) => (
              <RevealSection key={gig.id} delay={i * 0.08}>
                <GigCard gig={gig} showBook />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--color-cream)', paddingTop: '5rem', paddingBottom: '5.5rem' }}>
        <div className="container-xl">
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <p style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent-hover)', marginBottom: '0.5rem' }}>
                Simple Process
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-family-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  letterSpacing: '-0.025em',
                  color: 'var(--color-charcoal)',
                }}
              >
                How SkillSwap Works
              </h2>
            </div>
          </RevealSection>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
            }}
          >
            {HOW_STEPS.map((step, i) => (
              <RevealSection key={step.number} delay={i * 0.12}>
                <div style={{ position: 'relative' }}>
                  {/* Connector line (desktop) */}
                  {i < HOW_STEPS.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '2rem',
                        right: '-1rem',
                        left: 'calc(100% - 0rem)',
                        height: '1px',
                        background: 'linear-gradient(90deg, var(--color-accent-muted), transparent)',
                        display: 'none', // shown via inline style at md+
                      }}
                    />
                  )}

                  <div
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1.5px solid var(--color-border)',
                      borderRadius: 'var(--radius-card)',
                      padding: '2rem 1.75rem',
                      boxShadow: 'var(--shadow-card)',
                      position: 'relative',
                    }}
                  >
                    {/* Step number badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '1.25rem',
                        right: '1.25rem',
                        fontFamily: 'var(--font-family-display)',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        color: 'var(--color-accent-muted)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {step.number}
                    </span>

                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        backgroundColor: 'var(--color-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-charcoal)',
                        marginBottom: '1.25rem',
                      }}
                    >
                      {step.icon}
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-family-display)',
                        fontWeight: 800,
                        fontSize: '1.1875rem',
                        color: 'var(--color-charcoal)',
                        marginBottom: '0.625rem',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-soft)', lineHeight: 1.65 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. ABOUT / CLIENT LOGOS
      ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--color-cream-dark)', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-xl">
          {/* About blurb */}
          <RevealSection>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '3rem',
                alignItems: 'center',
                marginBottom: '5rem',
              }}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent-hover)', marginBottom: '0.75rem' }}>
                  About SkillSwap
                </p>
                <h2
                  style={{
                    fontFamily: 'var(--font-family-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                    letterSpacing: '-0.025em',
                    color: 'var(--color-charcoal)',
                    marginBottom: '1.25rem',
                    lineHeight: 1.15,
                  }}
                >
                  Built for Creators, <br />Designed for Results
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--color-ink-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  SkillSwap is a dedicated gig marketplace specialising in creative and technical services. With a focus on quality, transparency, and seamless collaboration, we connect ambitious clients with verified creators who deliver exceptional work.
                </p>
                <p style={{ fontSize: '1rem', color: 'var(--color-ink-soft)', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Every creator on SkillSwap is reviewed, every gig is structured, and every booking is straightforward — so you can focus on the work, not the paperwork.
                </p>
                <Link to="/discover" className="btn-primary">
                  Explore the Marketplace <ArrowRight size={16} />
                </Link>
              </div>

              {/* Stats grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                {[
                  { value: '2,400+', label: 'Active Gigs', sub: 'across 8 categories' },
                  { value: '800+', label: 'Creators', sub: 'verified profiles' },
                  { value: '98%', label: 'Satisfaction', sub: 'completion rate' },
                  { value: '24h', label: 'Avg. Response', sub: 'from top creators' },
                ].map(({ value, label, sub }) => (
                  <div
                    key={label}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1.5px solid var(--color-border)',
                      borderRadius: 'var(--radius-card)',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-family-display)',
                        fontWeight: 900,
                        fontSize: '2rem',
                        color: 'var(--color-charcoal)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                        marginBottom: '0.375rem',
                      }}
                    >
                      {value}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-ink)', marginBottom: '0.125rem' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>

          {/* Client logos strip */}
          <RevealSection>
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-card)',
                padding: '2.5rem 2rem',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--color-ink-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '2rem',
                }}
              >
                Trusted by creators from
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2.5rem 3rem',
                }}
              >
                {CLIENT_LOGOS.map(({ name, style }) => (
                  <span
                    key={name}
                    style={{
                      fontFamily: 'var(--font-family-display)',
                      color: 'var(--color-ink-muted)',
                      opacity: 0.65,
                      userSelect: 'none',
                      transition: 'opacity 0.2s',
                      ...style,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.65'; }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--color-cream)', paddingTop: '5rem', paddingBottom: '5.5rem' }}>
        <div className="container-xl">
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent-hover)', marginBottom: '0.5rem' }}>
                Real Stories
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-family-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  letterSpacing: '-0.025em',
                  color: 'var(--color-charcoal)',
                }}
              >
                What Our Community Says
              </h2>
            </div>
          </RevealSection>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <RevealSection key={t.name} delay={i * 0.1}>
                <div
                  className="card"
                  style={{
                    padding: '2rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem' }}>
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star
                        key={si}
                        size={14}
                        fill="var(--color-accent)"
                        color="var(--color-accent)"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      color: 'var(--color-ink)',
                      lineHeight: 1.7,
                      fontStyle: 'italic',
                      flex: 1,
                      marginBottom: '1.5rem',
                    }}
                  >
                    "{t.quote}"
                  </p>

                  <hr className="divider" style={{ marginBottom: '1.25rem' }} />

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={t.avatar}
                      alt={t.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--color-border)',
                      }}
                    />
                    <div>
                      <div style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-charcoal)' }}>
                        {t.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
                        {t.title}
                      </div>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. CREATOR CTA BAND
      ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--color-charcoal)', paddingTop: '5.5rem', paddingBottom: '5.5rem' }}>
        <div className="container-xl">
          <RevealSection>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem',
              }}
            >
              <div style={{ maxWidth: '600px' }}>
                {/* Accent label */}
                <p
                  style={{
                    fontFamily: 'var(--font-family-display)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    marginBottom: '0.75rem',
                  }}
                >
                  For Creators
                </p>

                <h2
                  style={{
                    fontFamily: 'var(--font-family-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                    letterSpacing: '-0.03em',
                    color: 'var(--color-cream)',
                    lineHeight: 1.1,
                    marginBottom: '1rem',
                  }}
                >
                  Your Skill Has Value.{' '}
                  <span style={{ color: 'var(--color-accent)' }}>Start Earning Today.</span>
                </h2>

                <p
                  style={{
                    fontSize: '1rem',
                    color: 'rgba(247,244,239,0.65)',
                    lineHeight: 1.7,
                  }}
                >
                  Join 800+ creators already monetising their expertise on SkillSwap. Set your own rates, work on your schedule, and grow your freelance career.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                <Link to="/create-gig" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                  Create Your First Gig <ArrowRight size={17} />
                </Link>
                <Link to="/discover" className="btn-ghost btn-ghost-light" style={{ fontSize: '0.9375rem' }}>
                  Browse as a Client
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
