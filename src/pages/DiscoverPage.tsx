// ============================================================
// SKILLSWAP — Discover Page (Marketplace)
// ============================================================
import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';

import { UsersAPI } from '@/lib/api';
import { useGigStore } from '@/store';
import { useDebounce } from '@/hooks/useDebounce';
import { CATEGORIES } from '@/data/seed';

import GigCard from '@/components/gigs/GigCard';
import LoadingSkeleton from '@/components/gigs/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';

// Flattened categories for the filter pill bar
const ALL_CATEGORY_PILLS = [
  { id: 'all', label: 'All', slug: '' },
  ...CATEGORIES.map(c => ({ id: c.id, label: c.name, slug: c.slug }))
];

export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL state
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  // Local state
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const syncingFromUrl = useRef(false);

  // Subscribe to gigStore — reactive: new gigs from Create Gig appear instantly
  const allGigs = useGigStore((s) => s.gigs);

  // Debounce search input by 250ms
  const debouncedSearch = useDebounce(searchInput, 250);

  // Keep URL-driven navigation in sync while this page stays mounted.
  useEffect(() => {
    syncingFromUrl.current = true;
    setSearchInput(searchParams.get('q') || '');
    setActiveCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  // Show skeleton on initial mount for ~500ms to mimic load feel
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Sync URL params when state changes (debounced search + category)
  useEffect(() => {
    if (syncingFromUrl.current) {
      syncingFromUrl.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (activeCategory !== 'all') params.set('category', activeCategory);
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [debouncedSearch, activeCategory, searchParams, setSearchParams]);

  // Derived filtered & sorted gigs
  const filteredGigs = useMemo(() => {
    let result = [...allGigs];

    // Filter by Category
    if (activeCategory !== 'all') {
      const catId = CATEGORIES.find(c => c.slug === activeCategory || c.id === activeCategory)?.id;
      if (catId) {
        result = result.filter(g => g.categoryId === catId);
      } else {
        result = []; // Invalid category matches nothing
      }
    }

    // Filter by Search Query (match title, tags, or creator name)
    const query = debouncedSearch.toLowerCase().trim();
    if (query) {
      result = result.filter(g => {
        const titleMatch = g.title.toLowerCase().includes(query);
        const tagMatch = g.tags.some(t => t.toLowerCase().includes(query));
        
        // Lookup creator name
        const creatorRes = UsersAPI.getById(g.sellerId);
        const creatorNameMatch = creatorRes.ok && creatorRes.data.name.toLowerCase().includes(query);

        return titleMatch || tagMatch || creatorNameMatch;
      });

      // Sort by relevance (title match > tag match > creator match) then recency
      result.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(query) ? 1 : 0;
        const bTitle = b.title.toLowerCase().includes(query) ? 1 : 0;
        if (aTitle !== bTitle) return bTitle - aTitle;
        
        // Fallback to recency
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else {
      // Discovery ranking: Blend categories to feel curated (we'll just sort by rating and order count for now)
      result.sort((a, b) => {
        const scoreA = (a.avgRating * 10) + a.orderCount;
        const scoreB = (b.avgRating * 10) + b.orderCount;
        return scoreB - scoreA;
      });
    }

    return result;
  }, [allGigs, activeCategory, debouncedSearch]);

  return (
    <div className="container-xl section-pad">
      
      {/* Header & Search */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-family-display)',
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--color-charcoal)',
            letterSpacing: '-0.02em',
            marginBottom: '1rem'
          }}
        >
          Discover Gigs
        </h1>
        
        <div style={{ position: 'relative', maxWidth: '500px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-ink-muted)'
            }}
          />
          <input
            type="text"
            className="input"
            placeholder="Search for skills, services, or creators..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '1rem', // room for scrollbar
          marginBottom: '2rem',
          scrollbarWidth: 'none', // Firefox
          WebkitOverflowScrolling: 'touch',
        }}
        // Hide webkit scrollbar
        className="hide-scrollbar"
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        
        {ALL_CATEGORY_PILLS.map(pill => {
          const isActive = activeCategory === pill.slug || activeCategory === pill.id || (pill.id === 'all' && activeCategory === 'all');
          const pillId = pill.slug || 'all';

          return (
            <button
              key={pill.id}
              onClick={() => setActiveCategory(pillId)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: isActive ? '1.5px solid var(--color-accent)' : '1.5px solid var(--color-border)',
                backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                color: isActive ? 'var(--color-charcoal)' : 'var(--color-ink-soft)',
              }}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div style={{ minHeight: '50vh' }}>
        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : filteredGigs.length > 0 ? (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '1.25rem',
            }}
          >
            <AnimatePresence>
              {filteredGigs.map((gig, index) => (
                <motion.div
                  key={gig.id}
                  layout
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut', delay: index * 0.035 }}
                >
                  <GigCard gig={gig} showBook />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyState
              onAction={() => {
                setSearchInput('');
                setActiveCategory('all');
              }}
              actionLabel="Clear Filters"
            />
          </motion.div>
        )}
      </div>

    </div>
  );
}

