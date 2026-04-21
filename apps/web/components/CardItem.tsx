"use client";

import { useState } from "react";
import { Card, Tag } from "@repo/db";
import { useBoardStore } from "@/app/stores/boardStore";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import CardDetail from "./CardDetail";

interface CardWithTags extends Card {
  tags?: Tag[];
  assignee?: { id: string; name: string; email: string } | null;
}

interface Props {
  card: CardWithTags;
}

const priorityConfig = {
  HIGH: {
    dot: "bg-destructive",
    label: "High",
    border: "border-l-destructive",
  },
  MEDIUM: {
    dot: "bg-yellow-400",
    label: "Medium",
    border: "border-l-yellow-400",
  },
  LOW: {
    dot: "bg-emerald-500",
    label: "Low",
    border: "border-l-emerald-500",
  },
};

const tagColorMap: Record<string, string> = {
  RED: "#ef4444",
  BLUE: "#3b82f6",
  GREEN: "#22c55e",
  YELLOW: "#eab308",
  PURPLE: "#a855f7",
  ORANGE: "#f97316",
  PINK: "#ec4899",
};

export default function CardItem({ card }: Props) {
  const deleteCard = useBoardStore((state) => state.deleteCard);
  const [open, setOpen] = useState(false);

  const priority = priorityConfig[card.priority];

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await api.delete(`/cards/${card.id}`);
      deleteCard(card.id);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`
          group cursor-pointer
          bg-card text-card-foreground
          rounded-lg border border-border/60
          border-l-2 ${priority.border}
          p-3 space-y-2
          hover:border-border hover:shadow-sm
          transition-all duration-150
        `}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug flex-1">
            {card.title}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {card.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {card.description}
          </p>
        )}

        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: tagColorMap[tag.color] + "33",
                  color: tagColorMap[tag.color],
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
            <span className="text-xs text-muted-foreground">
              {priority.label}
            </span>
          </div>
        </div>
      </div>

      <CardDetail cardId={card.id} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
