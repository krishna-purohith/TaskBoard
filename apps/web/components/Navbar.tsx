"use client";

import { useAuthStore } from "@/app/stores/authStore";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ButtonSkeleton } from "./ButtonSkeleton";
import GithubLogo from "./GithubIcon";
import { ModeToggle } from "./theme-toggle";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  async function handleLogout() {
    await api.post("/auth/logout", {});
    useAuthStore.getState().clearUser();
    router.push("/");
  }

  return (
    <header className="border-b bg-secondary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
        >
          <LayoutDashboard className="h-8 w-8 text-teal-400" />
          <span className="">TaskBoard</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/krishna-purohith/taskboard"
            target="_blank"
          >
            <GithubLogo />
          </Link>
          <ModeToggle />
          {isLoading ? (
            <div className="flex gap-3">
              <ButtonSkeleton className="h-7 w-16 bg-muted-foreground/10 rounded-md animate-pulse" />
              <ButtonSkeleton className="h-7 w-16 bg-muted-foreground/10 rounded-md animate-pulse" />
            </div>
          ) : user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="cursor-pointer bg-[#0e538b] hover:bg-[#1763a1] transition-colors border border-[#6f6f6f] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="min-w-max mt-4" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex flex-col gap-1">
                      <span className="text-sm text-secondary-foreground/90">
                        My Account
                      </span>
                      <p className="text-sm text-muted-foreground font-normal text-wrap">
                        {user.name}
                      </p>
                      <p className="text-sm font-normal text-muted-foreground">
                        {user.email}
                      </p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size={"sm"}>
                <Link href="/login">Login</Link>
              </Button>
              <Button
                className="bg-accent-foreground text-background"
                asChild
                size={"sm"}
              >
                <Link href="/signup">Signup</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
