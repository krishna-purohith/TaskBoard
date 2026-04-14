"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/authStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  useEffect(() => {
    if (!isLoading && !user) {
      console.log("redirecting to login");

      router.push("/login");
    }
  }, [user, isLoading]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
