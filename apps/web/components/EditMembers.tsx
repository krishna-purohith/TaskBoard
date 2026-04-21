"use client";

import { useState, useEffect, useCallback } from "react";
import { BoardWithRelations, useBoardStore } from "@/app/stores/boardStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/lib/api";
import { BoardMemberWithUser } from "@repo/types";
import { UserPlus, Trash2, Users } from "lucide-react";
import { useAuthStore } from "@/app/stores/authStore";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Props {
  board: BoardWithRelations;
}

export default function EditMembers({ board }: Props) {
  const { addMember, removeMember } = useBoardStore.getState();
  const currentUser = useAuthStore((state) => state.user);
  const [selectedRole, setSelectedRole] = useState<"MEMBER" | "OWNER">(
    "MEMBER"
  );

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"members" | "add">("members");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingUsers, setFetchingUsers] = useState(false);

  const memberUserIds = new Set(board.members.map((m) => m.userId));

  const fetchUsers = useCallback(async () => {
    if (allUsers.length > 0) return;
    setFetchingUsers(true);
    try {
      const users = await api.get<User[]>("/users");
      setAllUsers(users);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingUsers(false);
    }
  }, [allUsers.length]);

  useEffect(() => {
    if (open && view === "add") {
      fetchUsers();
    }
  }, [open, view, fetchUsers]);

  async function handleAdd() {
    if (!selectedUserId) return;
    setLoading(true);
    setError("");
    try {
      const selectedUser = allUsers.find((u) => u.id === selectedUserId);
      const member = await api.post<BoardMemberWithUser>(
        `/boards/${board.id}/members`,
        {
          email: selectedUser?.email,
          role: selectedRole,
        }
      );
      addMember(member);
      setSelectedUserId("");
      setView("members");
      setSelectedRole("MEMBER");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(userId: string) {
    try {
      await api.delete(`/boards/${board.id}/members/${userId}`);
      removeMember(userId);
    } catch (err) {
      console.error(err);
    }
  }

  const nonMembers = allUsers.filter((u) => !memberUserIds.has(u.id));

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setSelectedUserId("");
          setSelectedRole("MEMBER");
          setView("members");
          setError("");
        }
      }}
    >
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
          <Users className="h-4 w-4" />
          Edit Members
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="max-h-[100vh-var(--navbar-height)] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Board Members</SheetTitle>
          <SheetDescription>
            Check Add as Owner to grant owner privileges.
          </SheetDescription>
        </SheetHeader>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={view === "members" ? "default" : "outline"}
            onClick={() => setView("members")}
            className="flex-1"
          >
            Members ({board.members.length})
          </Button>
          <Button
            size="sm"
            variant={view === "add" ? "default" : "outline"}
            onClick={() => setView("add")}
            className="flex-1 gap-1"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
        {view === "members" && (
          <div className="flex flex-col gap-2 mt-4 flex-1 overflow-y-auto">
            {board.members.map((m) => (
              <div
                key={m.userId}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {m.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{m.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.role === "OWNER" ? (
                    <span className="text-xs text-destructive/70 bg-muted px-2 py-0.5 rounded-full">
                      {m.role}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {m.role}
                    </span>
                  )}

                  {m.userId !== currentUser?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      onClick={() => handleRemove(m.userId)}
                    >
                      <Trash2 className="h-3.5 w-3.5 " />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {view === "add" && (
          <div className="flex flex-col gap-3 mt-4 flex-1">
            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
              {fetchingUsers ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Loading Users...{" "}
                </p>
              ) : nonMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  All users are already members
                </p>
              ) : (
                nonMembers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedUserId === user.id
                        ? "border-primary bg-primary/10"
                        : "border-border/50 hover:border-primary/50 bg-muted/30"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 py-2 px-2 border-t border-border/50 sticky bottom-0">
                <Checkbox
                  id="owner"
                  className="cursor-pointer"
                  checked={selectedRole === "OWNER"}
                  onCheckedChange={(checked) =>
                    setSelectedRole(checked ? "OWNER" : "MEMBER")
                  }
                />
                <Label
                  htmlFor="owner"
                  className="text-sm text-destructive cursor-pointer"
                >
                  Add as Owner
                </Label>
              </div>

              <Button
                onClick={handleAdd}
                disabled={!selectedUserId || loading}
                className="w-full cursor-pointer"
              >
                {loading ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
