// ============================================================
// SKILLSWAP — API Adapter Layer
// ============================================================
// All data operations go through this file.
// Every function returns an ApiResult<T> so UI can handle
// success/error uniformly without knowing the persistence layer.
//
// TO MIGRATE TO A REAL BACKEND:
//   Replace each function body with the equivalent fetch() call.
//   The function signature and return type stay the same.

import type {
  User,
  Gig,
  Order,
  Review,
  Message,
  Conversation,
  Notification,
  GigSearchParams,
  PaginatedResult,
  ApiResult,
} from '@/types';

import {
  collectionGet,
  collectionGetById,
  collectionInsert,
  collectionUpdate,
  collectionDelete,
  storageGet,
  storageSet,
  generateId,
  mkError,
} from './storage';

// ── Collection keys ───────────────────────────────────────────
const USERS         = 'users';
const GIGS          = 'gigs';
const ORDERS        = 'orders';
const REVIEWS       = 'reviews';
const MESSAGES      = 'messages';
const CONVERSATIONS = 'conversations';
const NOTIFICATIONS = 'notifications';
const AUTH_KEY      = 'auth_user_id';

// ── Auth ──────────────────────────────────────────────────────

export const AuthAPI = {
  getCurrentUserId(): string | null {
    return storageGet<string>(AUTH_KEY);
  },

  login(userId: string): void {
    storageSet(AUTH_KEY, userId);
  },

  logout(): void {
    storageSet(AUTH_KEY, null);
  },

  getCurrentUser(): User | null {
    const id = AuthAPI.getCurrentUserId();
    if (!id) return null;
    return collectionGetById<User>(USERS, id);
  },
};

// ── Users ─────────────────────────────────────────────────────

export const UsersAPI = {
  getById(id: string): ApiResult<User> {
    const user = collectionGetById<User>(USERS, id);
    if (!user) return { ok: false, error: mkError('NOT_FOUND', 'User not found.') };
    return { ok: true, data: user };
  },

  create(user: Omit<User, 'id'>): ApiResult<User> {
    const newUser: User = { ...user, id: generateId('usr') };
    return collectionInsert<User>(USERS, newUser);
  },

  update(id: string, patch: Partial<User>): ApiResult<User> {
    return collectionUpdate<User>(USERS, id, patch);
  },
};

// ── Gigs ──────────────────────────────────────────────────────

export const GigsAPI = {
  search(params: GigSearchParams = {}): ApiResult<PaginatedResult<Gig>> {
    let gigs = collectionGet<Gig>(GIGS);
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    // Filter
    if (params.query) {
      const q = params.query.toLowerCase();
      gigs = gigs.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (params.categoryId) {
      gigs = gigs.filter((g) => g.categoryId === params.categoryId);
    }
    if (params.minPrice !== undefined) {
      gigs = gigs.filter((g) => g.packages[0].price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      gigs = gigs.filter((g) => g.packages[0].price <= params.maxPrice!);
    }
    if (params.minRating !== undefined) {
      gigs = gigs.filter((g) => g.avgRating >= params.minRating!);
    }

    // Sort
    switch (params.sortBy) {
      case 'price_asc':
        gigs.sort((a, b) => a.packages[0].price - b.packages[0].price);
        break;
      case 'price_desc':
        gigs.sort((a, b) => b.packages[0].price - a.packages[0].price);
        break;
      case 'rating':
        gigs.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case 'newest':
        gigs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
    }

    const total = gigs.length;
    const data = gigs.slice((page - 1) * pageSize, page * pageSize);

    return {
      ok: true,
      data: { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  },

  getById(id: string): ApiResult<Gig> {
    const gig = collectionGetById<Gig>(GIGS, id);
    if (!gig) return { ok: false, error: mkError('NOT_FOUND', 'Gig not found.') };
    return { ok: true, data: gig };
  },

  create(gig: Omit<Gig, 'id'>): ApiResult<Gig> {
    const newGig: Gig = { ...gig, id: generateId('gig') };
    return collectionInsert<Gig>(GIGS, newGig);
  },

  update(id: string, patch: Partial<Gig>): ApiResult<Gig> {
    return collectionUpdate<Gig>(GIGS, id, { ...patch, updatedAt: new Date().toISOString() });
  },

  delete(id: string): ApiResult<{ id: string }> {
    return collectionDelete<Gig>(GIGS, id);
  },
};

// ── Orders ────────────────────────────────────────────────────

export const OrdersAPI = {
  getById(id: string): ApiResult<Order> {
    const order = collectionGetById<Order>(ORDERS, id);
    if (!order) return { ok: false, error: mkError('NOT_FOUND', 'Order not found.') };
    return { ok: true, data: order };
  },

  getByUser(userId: string, role: 'buyer' | 'seller'): Order[] {
    return collectionGet<Order>(ORDERS).filter((o) =>
      role === 'buyer' ? o.buyerId === userId : o.sellerId === userId,
    );
  },

  create(order: Omit<Order, 'id'>): ApiResult<Order> {
    const newOrder: Order = { ...order, id: generateId('ord') };
    return collectionInsert<Order>(ORDERS, newOrder);
  },

  update(id: string, patch: Partial<Order>): ApiResult<Order> {
    return collectionUpdate<Order>(ORDERS, id, { ...patch, updatedAt: new Date().toISOString() });
  },
};

// ── Reviews ───────────────────────────────────────────────────

export const ReviewsAPI = {
  getByGig(gigId: string): Review[] {
    return collectionGet<Review>(REVIEWS).filter((r) => r.gigId === gigId);
  },

  create(review: Omit<Review, 'id'>): ApiResult<Review> {
    const newReview: Review = { ...review, id: generateId('rev') };
    const result = collectionInsert<Review>(REVIEWS, newReview);

    // Recompute avg rating on the gig
    if (result.ok) {
      const reviews = ReviewsAPI.getByGig(review.gigId);
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      GigsAPI.update(review.gigId, { avgRating: Math.round(avg * 10) / 10, reviewCount: reviews.length });
    }

    return result;
  },
};

// ── Messages ──────────────────────────────────────────────────

export const MessagesAPI = {
  getByConversation(conversationId: string): Message[] {
    return collectionGet<Message>(MESSAGES)
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  send(message: Omit<Message, 'id'>): ApiResult<Message> {
    const newMsg: Message = { ...message, id: generateId('msg') };
    return collectionInsert<Message>(MESSAGES, newMsg);
  },
};

export const ConversationsAPI = {
  getByUser(userId: string): Conversation[] {
    return collectionGet<Conversation>(CONVERSATIONS).filter((c) =>
      c.participantIds.includes(userId),
    );
  },

  getOrCreate(userA: string, userB: string, gigId?: string): Conversation {
    const existing = collectionGet<Conversation>(CONVERSATIONS).find(
      (c) => c.participantIds.includes(userA) && c.participantIds.includes(userB),
    );
    if (existing) return existing;

    const newConv: Conversation = {
      id: generateId('conv'),
      participantIds: [userA, userB],
      gigId,
      unreadCount: 0,
    };
    collectionInsert<Conversation>(CONVERSATIONS, newConv);
    return newConv;
  },
};

// ── Notifications ─────────────────────────────────────────────

export const NotificationsAPI = {
  getByUser(userId: string): Notification[] {
    return collectionGet<Notification>(NOTIFICATIONS)
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  markRead(id: string): ApiResult<Notification> {
    return collectionUpdate<Notification>(NOTIFICATIONS, id, { isRead: true });
  },

  create(notification: Omit<Notification, 'id'>): ApiResult<Notification> {
    const newN: Notification = { ...notification, id: generateId('notif') };
    return collectionInsert<Notification>(NOTIFICATIONS, newN);
  },
};

