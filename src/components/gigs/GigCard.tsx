import { Link } from 'react-router-dom';
import { Star, Clock, ArrowRight, CalendarPlus } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Gig, User } from '@/types';
import { formatPrice, formatCount } from '@/lib/utils';
import { UsersAPI } from '@/lib/api';

interface GigCardProps {
  gig: Gig;
  /** If provided the card expands to show Book Now button */
  showBook?: boolean;
}

function getSeller(id: string): User | undefined {
  const res = UsersAPI.getById(id);
  return res.ok ? res.data : undefined;
}

export default function GigCard({ gig, showBook = true }: GigCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const seller = getSeller(gig.sellerId);
  const basePrice = gig.packages[0]?.price ?? 0;
  const heroImage = gig.images[0];

  return (
    <motion.div
      className="card gig-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -1, boxShadow: 'var(--shadow-card-hover)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* ── Hero image ──────────────────────────────────────── */}
      <Link
        to={`/gig/${gig.id}`}
        className="gig-card-media"
        style={{ display: 'block', position: 'relative', flexShrink: 0 }}
      >
        <div
          style={{
            aspectRatio: '16 / 10',
            backgroundColor: 'var(--color-cream-dark)',
            overflow: 'hidden',
          }}
        >
          {heroImage ? (
            <img
              src={heroImage}
              alt={gig.title}
              className="gig-card-image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--color-cream-dark)',
              }}
            />
          )}
        </div>

        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {gig.isFeatured && (
            <span className="tag" style={{ alignSelf: 'flex-start' }}>
              ⭐ Featured
            </span>
          )}
          {gig.status === 'unavailable' && (
            <span
              className="tag"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                border: 'none',
                alignSelf: 'flex-start'
              }}
            >
              Currently Unavailable
            </span>
          )}
        </div>
      </Link>

      {/* ── Card body ───────────────────────────────────────── */}
      <div style={{ padding: '1.125rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Seller row */}
        {seller && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.625rem',
            }}
          >
            {seller.avatar ? (
              <img
                src={seller.avatar}
                alt={seller.name}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid var(--color-border)',
                  flexShrink: 0,
                }}
              />
            ) : (
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: 'var(--color-accent-hover)',
                  flexShrink: 0,
                }}
              >
                {seller.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-ink-soft)' }}>
              {seller.name}
            </span>
            {seller.isVerified && (
              <span style={{ fontSize: '0.625rem', color: 'var(--color-accent-hover)', fontWeight: 700 }}>✓</span>
            )}
          </div>
        )}

        {/* Title */}
        <Link
          to={`/gig/${gig.id}`}
          style={{ textDecoration: 'none', flex: 1 }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 700,
              fontSize: '0.9375rem',
              color: 'var(--color-ink)',
              lineHeight: 1.35,
              marginBottom: '0.5rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {gig.title}
          </h3>

          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-ink-soft)',
              lineHeight: 1.55,
              marginBottom: '0.875rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {gig.shortDescription}
          </p>
        </Link>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.875rem' }}>
          {gig.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--color-ink-muted)',
                backgroundColor: 'var(--color-cream-dark)',
                padding: '0.2rem 0.5rem',
                borderRadius: '999px',
                textTransform: 'lowercase',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <hr className="divider" style={{ marginBottom: '0.875rem' }} />

        {/* Stats + price row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: showBook ? '0.875rem' : 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Rating */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-ink)',
              }}
            >
              <Star size={13} fill="var(--color-accent)" color="var(--color-accent)" />
              {gig.avgRating.toFixed(1)}
              <span style={{ color: 'var(--color-ink-muted)', fontWeight: 400 }}>
                ({formatCount(gig.reviewCount)})
              </span>
            </span>

            {/* Delivery */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
                color: 'var(--color-ink-muted)',
              }}
            >
              <Clock size={12} />
              {gig.packages[0]?.deliveryDays}d
            </span>
          </div>

          {/* Price */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-ink-muted)' }}>From</span>
            <div
              style={{
                fontFamily: 'var(--font-family-display)',
                fontWeight: 800,
                fontSize: '1.0625rem',
                color: 'var(--color-charcoal)',
              }}
            >
              {formatPrice(basePrice)}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {showBook && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to={`/gig/${gig.id}`}
              className="gig-card-action gig-card-action-secondary"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-btn)',
                border: '1.5px solid var(--color-border)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-ink)',
                textDecoration: 'none',
                backgroundColor: 'transparent',
                transition: 'border-color 0.15s, background-color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-ink)';
                e.currentTarget.style.backgroundColor = 'var(--color-cream-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              View Gig <ArrowRight size={13} />
            </Link>
            {gig.status === 'unavailable' ? (
              <div
                className="gig-card-action gig-card-action-unavailable"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-btn)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-ink-muted)',
                  cursor: 'not-allowed',
                }}
              >
                Unavailable
              </div>
            ) : (
              <Link
                to={`/gig/${gig.id}?action=book`}
                className="gig-card-action gig-card-action-primary"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-btn)',
                  backgroundColor: 'var(--color-accent)',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-charcoal)',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-accent)'; }}
              >
                Book Now <CalendarPlus size={13} />
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

