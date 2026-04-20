"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/app/stores/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    async function initAuth() {
      try {
        const data = await api.get<{
          id: string;
          name: string;
          email: string;
        }>("/auth/me");
        useAuthStore.getState().setUser(data);
      } catch {
        useAuthStore.getState().clearUser();
      }
    }
    initAuth();
  }, []);

  return <>{children}</>;
}
