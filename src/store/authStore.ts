// ============================================================
// SKILLSWAP — Auth Store (Zustand)
// ============================================================
import { create } from 'zustand';
import type { User } from '@/types';
import { AuthAPI, UsersAPI } from '@/lib/api';
import { generateId } from '@/lib/storage';

interface AuthState {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  init: () => void;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: User['role'];
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isLoading: true,
  isAuthenticated: false,

  init() {
    const user = AuthAPI.getCurrentUser();
    set({ currentUser: user, isLoading: false, isAuthenticated: !!user });
  },

  async login(email, _password) {
    // In localStorage mode we just find the user by email.
    // A real backend would POST /auth/login and get a JWT.
    const { storageGet } = await import('@/lib/storage');
    const users = storageGet<User[]>('skillswap_users') ?? [];
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { ok: false, error: 'No account found with that email.' };
    }
    AuthAPI.login(user.id);
    set({ currentUser: user, isAuthenticated: true });
    return { ok: true };
  },

  async register({ name, email, role }) {
    const newUser: User = {
      id: generateId('usr'),
      name,
      email,
      role,
      isVerified: false,
      memberSince: new Date().toISOString(),
      stats: { totalOrders: 0, completionRate: 0, avgRating: 0, reviewCount: 0 },
    };
    const result = UsersAPI.create(newUser);
    if (!result.ok) return { ok: false, error: result.error.message };
    AuthAPI.login(newUser.id);
    set({ currentUser: newUser, isAuthenticated: true });
    return { ok: true };
  },

  logout() {
    AuthAPI.logout();
    set({ currentUser: null, isAuthenticated: false });
  },

  updateProfile(patch) {
    const { currentUser } = get();
    if (!currentUser) return;
    UsersAPI.update(currentUser.id, patch);
    set({ currentUser: { ...currentUser, ...patch } });
  },
}));

