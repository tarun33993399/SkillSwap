// ============================================================
// SKILLSWAP — Core Domain Types
// ============================================================
// Designed so a real REST/GraphQL backend can slot in later
// without changing any UI component — just swap the lib/api.ts
// adapters and remove localStorage persistence.

// ── User ─────────────────────────────────────────────────────

export type UserRole = 'buyer' | 'seller' | 'both';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  location?: string;
  memberSince: string; // ISO date string
  isVerified: boolean;
  stats: {
    totalOrders: number;
    completionRate: number; // 0-100
    avgRating: number;      // 0-5
    reviewCount: number;
  };
}

// ── Skill Category ────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string; // lucide icon name
  description: string;
  gigCount: number;
}

// ── Gig (Service Listing) ─────────────────────────────────────

export type PricingTier = 'basic' | 'standard' | 'premium';

export interface GigPackage {
  tier: PricingTier;
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
}

export interface Gig {
  id: string;
  sellerId: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  tags: string[];
  images: string[];         // URLs
  packages: GigPackage[];   // [basic, standard, premium]
  avgRating: number;
  reviewCount: number;
  orderCount: number;
  isFeatured: boolean;
  status?: 'active' | 'unavailable';
  createdAt: string;
  updatedAt: string;
}

// ── Review ────────────────────────────────────────────────────

export interface Review {
  id: string;
  gigId: string;
  buyerId: string;
  sellerId: string;
  orderId: string;
  rating: number;         // 1-5
  comment: string;
  createdAt: string;
}

// ── Order ─────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'in_progress'
  | 'delivered'
  | 'revision_requested'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface Order {
  id: string;
  gigId: string;
  buyerId: string;
  sellerId: string;
  package: GigPackage;
  status: OrderStatus;
  requirements: string;
  deliverables?: string[];  // URLs to delivered files
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

// ── Message / Chat ────────────────────────────────────────────

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: [string, string];
  gigId?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

// ── Notifications ─────────────────────────────────────────────

export type NotificationType =
  | 'order_placed'
  | 'order_delivered'
  | 'review_received'
  | 'message_received'
  | 'order_completed';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  linkTo?: string;
  createdAt: string;
}

export type AppNotificationType =
  | 'booking_request'
  | 'booking_accepted'
  | 'booking_declined'
  | 'gig_published'
  | 'gig_updated'
  | 'profile_updated'
  | 'system';

export interface AppNotification {
  id: string;
  userId: string;
  type: AppNotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

// ── Pagination / API shapes ───────────────────────────────────
// These mirror what a real REST response would return,
// so swapping localStorage → fetch() only touches lib/api.ts

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

// ── Filter / search params ────────────────────────────────────

export interface GigSearchParams {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  deliveryDays?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  pageSize?: number;
}

// ── Booking ───────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'accepted' | 'declined';

export interface Booking {
  id: string;
  gigId: string;
  creatorId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  requirements: string;
  deadline?: string;   // ISO date string (optional)
  rate: number;       // price agreed (from gig package)
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}
