"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, PartnerRole } from "@/types";
import { DEMO_USERS } from "@/lib/constants";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setHydrated: (value: boolean) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: Partial<User> & { password: string }) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      setHydrated: (value) => set({ isHydrated: value }),
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));

        const found = DEMO_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (found) {
          const { password: _pw, ...user } = found;
          set({ user: user as User, isAuthenticated: true, isLoading: false });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      register: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000));
        const newUser: User = {
          id: String(Date.now()),
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role as PartnerRole,
          organizationName: data.organizationName || "",
          address: data.address || "",
          isApproved: false,
          createdAt: new Date().toISOString(),
        };
        set({ user: newUser, isAuthenticated: true, isLoading: false });
        return true;
      },
    }),
    {
      name: "mitra-dewi-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, _error) => {
        state?.setHydrated(true);
      },
    }
  )
);
