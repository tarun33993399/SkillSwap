// ============================================================
// SKILLSWAP — Root App Component
// ============================================================
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from '@/router';
import { useAuthStore, useGigStore, useBookingStore, useNotificationStore } from '@/store';
import { seedDatabase } from '@/data/seed';

function App() {
  const initAuth = useAuthStore((s) => s.init);
  const loadGigs = useGigStore((s) => s.load);
  const loadBookings = useBookingStore((s) => s.load);
  const loadNotifications = useNotificationStore((s) => s.load);

  useEffect(() => {
    // Seed mock data on first-ever load
    seedDatabase();
    // Bootstrap reactive stores from localStorage
    loadGigs();
    loadBookings();
    loadNotifications();
    // Restore auth session from localStorage
    initAuth();
  }, [initAuth, loadGigs, loadBookings, loadNotifications]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
