import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PostUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

interface AuthState {
  user: PostUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: PostUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'threads-auth-storage', // name of the item in the storage (must be unique)
      // sessionStorage is used by default for persist middleware if not specified,
      // but to be explicit we can use sessionStorage.
      // We will stick to the default which is localStorage, as it allows persistence
      // across tabs which is better for user experience.
    }
  )
);
