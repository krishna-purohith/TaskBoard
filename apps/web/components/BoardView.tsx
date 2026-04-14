"use client";

import { useBoardStore } from "@/app/stores/boardStore";
import Column from "./Column";
import AddColumn from "./AddColumn";
import { useAuthStore } from "@/app/stores/authStore";

export default function BoardView() {
  const board = useBoardStore((state) => state.board);
  const currentUser = useAuthStore((state) => state.user);

  if (!board) return null;

  const currentMember = board.members.find((m) => m.userId === currentUser?.id);
  const isOwner = currentMember?.role === "OWNER";

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="px-6 py-3 border-b bg-background/80 backdrop-blur-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">{board.title}</h2>
              {isOwner && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Owner
                </span>
              )}
            </div>
            {board.description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {board.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {board.members.map((m, index) => (
              <div
                key={m.userId}
                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold ring-2 ring-background"
                style={{ marginLeft: index > 0 ? "-8px" : "0" }}
                title={`${m.user.name} (${m.role})`}
              >
                {m.user.name.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {board.members.length}{" "}
            {board.members.length === 1 ? "member" : "members"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden ">
        <div className="flex gap-3 p-4 items-start min-w-max h-full">
          {board.columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
          <AddColumn boardId={board.id} />
        </div>
      </div>
    </div>
  );
}
