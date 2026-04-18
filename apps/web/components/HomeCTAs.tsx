"use client";
import { useAuthStore } from "@/app/stores/authStore";
import { Button } from "./ui/button";
import Link from "next/link";
import { ButtonSkeleton } from "./ButtonSkeleton";
import { useShallow } from "zustand/shallow";

export function HomeCTAs() {
  const { user, isLoading } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isLoading: state.isLoading,
    }))
  );

  if (isLoading) {
    return (
      <ButtonSkeleton className="h-9 w-24 animate-pulse rounded-md bg-muted" />
    );
  }
  return user ? (
    <>
      <Button size="lg" asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </>
  ) : (
    <>
      <Button size="lg" asChild>
        <Link href="/signup">Get started free</Link>
      </Button>
      <Button size="lg" variant="outline" asChild>
        <Link href="/login">Sign in</Link>
      </Button>
    </>
  );
}
