// ============================================================
// SKILLSWAP — App Router
// ============================================================
import { Routes, Route } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import HomePage from '@/pages/HomePage';
import DiscoverPage from '@/pages/DiscoverPage';
import GigDetailPage from '@/pages/GigDetailPage';
import DashboardPage from '@/pages/DashboardPage';
import BookingsPage from '@/pages/BookingsPage';
import CreateGigPage from '@/pages/CreateGigPage';
import EditGigPage from '@/pages/EditGigPage';
import {
  ProfilePage,
  AuthPage,
  NotFoundPage,
} from '@/pages/Placeholders';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="gig/:id" element={<GigDetailPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="create-gig" element={<CreateGigPage />} />
        <Route path="edit-gig/:id" element={<EditGigPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
