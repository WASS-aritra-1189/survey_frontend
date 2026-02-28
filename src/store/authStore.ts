import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Account, Tokens } from "@/types/auth";

interface AuthState {
  account: Account | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  setAuth: (account: Account, tokens: Tokens) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      account: null,
      tokens: null,
      isAuthenticated: false,
      setAuth: (account, tokens) =>
        set({ account, tokens, isAuthenticated: true }),
      logout: () =>
        set({ account: null, tokens: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
