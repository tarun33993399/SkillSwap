// ============================================================
// SKILLSWAP — gigStore (Zustand)
// Wraps GigsAPI so new/updated gigs are reactive across all
// components that subscribe to this store, without a page reload.
// ============================================================
import { create } from 'zustand';
import type { Gig } from '@/types';
import { GigsAPI } from '@/lib/api';

interface GigState {
  gigs: Gig[];
  load: () => void;
  addGig: (gig: Gig) => void;
  updateGig: (gig: Gig) => void;
}

export const useGigStore = create<GigState>((set) => ({
  gigs: [],

  load() {
    const res = GigsAPI.search({ pageSize: 1000 });
    if (res.ok) set({ gigs: res.data.data });
  },

  addGig(gig) {
    set((s) => ({ gigs: [gig, ...s.gigs] }));
  },

  updateGig(updated) {
    set((s) => ({
      gigs: s.gigs.map((g) => (g.id === updated.id ? updated : g)),
    }));
  },
}));

