// ============================================================
// SKILLSWAP — Booking Store (Zustand)
// ============================================================
import { create } from 'zustand';
import type { Booking, BookingStatus } from '@/types';
import {
  collectionGet,
  collectionInsert,
  collectionUpdate,
  generateId,
} from '@/lib/storage';

const COLLECTION = 'bookings';

interface BookingState {
  bookings: Booking[];

  // Actions
  load: () => void;
  add: (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => Booking;
  updateStatus: (id: string, status: BookingStatus) => void;

  // Selectors (memoised slices — call in components)
  forCreator: (creatorId: string) => Booking[];
  forClient: (clientId: string) => Booking[];
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],

  load() {
    const bookings = collectionGet<Booking>(COLLECTION);
    set({ bookings });
  },

  add(data) {
    const now = new Date().toISOString();
    const booking: Booking = {
      ...data,
      id: generateId('bk'),
      createdAt: now,
      updatedAt: now,
    };
    collectionInsert<Booking>(COLLECTION, booking);
    set((s) => ({ bookings: [...s.bookings, booking] }));
    return booking;
  },

  updateStatus(id, status) {
    const updatedAt = new Date().toISOString();
    collectionUpdate<Booking>(COLLECTION, id, { status, updatedAt });
    set((s) => ({
      bookings: s.bookings.map((b) =>
        b.id === id ? { ...b, status, updatedAt } : b,
      ),
    }));
  },

  forCreator: (creatorId) =>
    get().bookings.filter((b) => b.creatorId === creatorId),

  forClient: (clientId) =>
    get().bookings.filter((b) => b.clientId === clientId),
}));

