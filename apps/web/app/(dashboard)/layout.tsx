"use client";

import { useAuthStore } from "@/app/stores/authStore";
import { SpinnerCustom } from "@/components/SpinnerCustom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      useAuthStore.getState().clearUser();
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <SpinnerCustom loadingMessage="Loading..." />
      </div>
    );

  if (!user)
    return (
      <div className="flex-1 flex items-center justify-center">
        <SpinnerCustom loadingMessage="Redirecting..." />
      </div>
    );

  return <>{children}</>;
}
