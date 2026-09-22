// ============================================================
// SKILLSWAP — UI / App State Store (Zustand)
// ============================================================
import { create } from 'zustand';

interface UIState {
  // Mobile nav
  mobileNavOpen: boolean;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;

  // Search / filter state (shared between header and browse page)
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Toast notifications (lightweight, no external lib needed)
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Global loading state (e.g., page transitions)
  isPageLoading: boolean;
  setPageLoading: (v: boolean) => void;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number; // ms, default 4000
}

let toastCounter = 0;

export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
  closeMobileNav: () => set({ mobileNavOpen: false }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),

  toasts: [],
  addToast: (toast) => {
    const id = `toast_${++toastCounter}`;
    const duration = toast.duration ?? 4000;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    // Auto-remove after duration
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  isPageLoading: false,
  setPageLoading: (v) => set({ isPageLoading: v }),
}));

