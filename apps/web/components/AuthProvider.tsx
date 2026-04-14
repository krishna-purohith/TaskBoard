"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/app/stores/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    async function initAuth() {
      try {
        const res = await api.get<{
          data: { id: string; name: string; email: string };
        }>("/auth/me");
        setUser(res.data);
      } catch {
        clearUser();
      }
    }
    initAuth();
  }, []);

  return <>{children}</>;
}
