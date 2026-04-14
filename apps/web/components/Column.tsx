"use client";

import { useState } from "react";
import { Column as ColumnType, Card, Tag } from "@repo/db";
import { api } from "@/lib/api";
import { useBoardStore } from "@/app/stores/boardStore";
import CardItem from "./CardItem";
import AddCard from "./AddCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CardWithTags extends Card {
  tags?: Tag[];
  assignee?: { id: string; name: string; email: string } | null;
}

interface Props {
  column: ColumnType & { cards: CardWithTags[] };
}

export default function Column({ column }: Props) {
  const updateColumn = useBoardStore((state) => state.updateColumn);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  async function handleUpdateTitle() {
    if (title === column.title) {
      setEditing(false);
      return;
    }
    try {
      const res = await api.put<{ data: ColumnType }>(`/columns/${column.id}`, {
        title,
      });
      updateColumn(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEditing(false);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/columns/${column.id}`);
      deleteColumn(column.id);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      className="w-72 shrink-0 flex flex-col rounded-xl bg-muted/50 dark:bg-muted/20 border border-border/50 max-h-[calc(100vh-10rem)]
 overflow-y-auto"
    >
      <div className="sticky top-0 z-10 px-3 py-2.5 flex items-center justify-between bg-muted/50 dark:bg-muted/20 backdrop-blur-sm shrink-0">
        {editing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdateTitle();
              if (e.key === "Escape") {
                setTitle(column.title);
                setEditing(false);
              }
            }}
            autoFocus
            className="h-7 text-xs font-semibold uppercase tracking-wide px-2"
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {column.title}
            </span>
            <span className="text-xs text-muted-foreground/60 bg-muted dark:bg-muted/40 rounded-full px-1.5 py-0.5">
              {column.cards.length}
            </span>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => setEditing(true)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-2 px-2 py-1">
        {column.cards.length === 0 ? (
          <div className="flex items-center justify-center py-6 text-xs text-muted-foreground/50 border border-dashed border-border/50 rounded-lg">
            No cards yet
          </div>
        ) : (
          column.cards.map((card) => <CardItem key={card.id} card={card} />)
        )}
      </div>

      <div className="px-2 py-2 border-t border-dashed border-border/50">
        <AddCard columnId={column.id} />
      </div>
    </div>
  );
}
