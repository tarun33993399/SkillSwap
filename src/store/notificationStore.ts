import { create } from 'zustand';
import type { AppNotification, AppNotificationType } from '@/types';
import { collectionGet, collectionInsert, collectionUpdate, generateId } from '@/lib/storage';

const COLLECTION = 'notifications';

interface NotificationState {
  notifications: AppNotification[];
  load: () => void;
  add: (data: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => AppNotification;
  markRead: (id: string) => void;
  markAllRead: (userId: string) => void;
  forUser: (userId: string) => AppNotification[];
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  load() {
    set({ notifications: collectionGet<AppNotification>(COLLECTION) });
  },

  add(data) {
    const notification: AppNotification = {
      ...data,
      id: generateId('ntf'),
      read: false,
      createdAt: new Date().toISOString(),
    };
    collectionInsert<AppNotification>(COLLECTION, notification);
    set((state) => ({ notifications: [notification, ...state.notifications] }));
    return notification;
  },

  markRead(id) {
    collectionUpdate<AppNotification>(COLLECTION, id, { read: true });
    set((state) => ({ notifications: state.notifications.map((item) => item.id === id ? { ...item, read: true } : item) }));
  },

  markAllRead(userId) {
    const userNotifications = get().notifications.filter((item) => item.userId === userId && !item.read);
    userNotifications.forEach((item) => collectionUpdate<AppNotification>(COLLECTION, item.id, { read: true }));
    set((state) => ({ notifications: state.notifications.map((item) => item.userId === userId ? { ...item, read: true } : item) }));
  },

  forUser(userId) {
    return get().notifications.filter((item) => item.userId === userId);
  },
}));

export type { AppNotificationType };