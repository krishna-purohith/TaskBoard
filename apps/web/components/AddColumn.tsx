"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useBoardStore } from "@/app/stores/boardStore";
import { Column } from "@repo/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export default function AddColumn({ boardId }: { boardId: string }) {
  const addColumn = useBoardStore((state) => state.addColumn);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  async function handleAdd() {
    if (!title.trim()) return;
    try {
      const res = await api.post<{ data: Column }>("/columns", {
        title,
        boardId,
      });
      addColumn(res.data);
      setTitle("");
      setAdding(false);
    } catch (err) {
      console.error(err);
    }
  }

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="w-72 shrink-0 rounded-lg border-2 border-dashed border-muted-foreground/30 p-4 flex items-center gap-2 text-muted-foreground hover:border-muted-foreground/60 hover:text-foreground transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm">Add column</span>
      </button>
    );
  }

  return (
    <div className="w-72 shrink-0 bg-muted rounded-lg p-3 space-y-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Column title"
        autoFocus
        className="h-8 text-sm"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleAdd}>
          Add
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setAdding(false);
            setTitle("");
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
