"use client";

import { useAuthStore } from "@/app/stores/authStore";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./theme-toggle";

export default function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  async function handleLogout() {
    await api.post("/auth/logout", {});
    clearUser();
    router.push("/");
  }

  return (
    <header className="border-b bg-secondary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
        >
          <LayoutDashboard className="h-8 w-8 text-teal-400" />
          <span className="text-teal-500">TaskBoard</span>
        </Link>

        <div className="flex items-center gap-3">
          <ModeToggle />
          {/* Add github link heree */}
          {user ? (
            <>
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {user.name}
                </span>
              </div>
              <Button
                className="cursor-pointer"
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                className="cursor-pointer"
                variant="ghost"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => router.push("/signup")}
              >
                Signup
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
