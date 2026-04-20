import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  setUser(user) {
    set({ user, isLoading: false });
  },

  clearUser() {
    set({ user: null, isLoading: false });
  },

  setLoading(loading) {
    set({ isLoading: loading });
  },
}));
