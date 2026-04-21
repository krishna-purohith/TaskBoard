"use client";

import { useBoardStore } from "@/app/stores/boardStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { Card } from "@repo/db";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AddCard({ columnId }: { columnId: string }) {
  const addCard = useBoardStore((state) => state.addCard);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  async function handleAdd() {
    if (!title.trim()) return;
    try {
      const res = await api.post<Card>("/cards", {
        title,
        columnId,
      });
      addCard(res);
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
        className="w-full flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm py-1 transition-colors"
      >
        <Plus className="h-3 w-3" />
        Add card
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Card title"
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
