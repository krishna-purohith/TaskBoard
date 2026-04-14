"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useBoardStore } from "@/app/stores/boardStore";
import { Card, Comment, Tag } from "@repo/db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { useAuthStore } from "@/app/stores/authStore";

interface CardWithRelations extends Card {
  comments: (Comment & {
    user: { id: string; name: string; email: string };
  })[];
  tags: Tag[];
}

interface Props {
  cardId: string;
  open: boolean;
  onClose: () => void;
}

export default function CardDetail({ cardId, open, onClose }: Props) {
  const updateCard = useBoardStore((state) => state.updateCard);
  const addComment = useBoardStore((state) => state.addComment);
  const deleteComment = useBoardStore((state) => state.deleteComment);
  const user = useAuthStore((state) => state.user);

  const [card, setCard] = useState<CardWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;

    async function fetchCard() {
      try {
        const [cardRes, tagsRes] = await Promise.all([
          api.get<{ data: CardWithRelations }>(`/cards/${cardId}`),
          api.get<{ data: Tag[] }>("/tags"),
        ]);
        setCard(cardRes.data);
        setTitle(cardRes.data.title);
        setDescription(cardRes.data.description || "");
        setAllTags(tagsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCard();
  }, [cardId, open]);

  async function handleUpdateTitle() {
    if (!card || title === card.title) {
      setEditingTitle(false);
      return;
    }
    try {
      const res = await api.put<{ data: Card }>(`/cards/${card.id}`, {
        title,
      });
      updateCard(res.data);
      setCard((prev) => (prev ? { ...prev, title } : prev));
    } catch (err) {
      console.error(err);
    } finally {
      setEditingTitle(false);
    }
  }

  async function handleUpdateDescription() {
    if (!card) return;
    try {
      const res = await api.put<{ data: Card }>(`/cards/${card.id}`, {
        description,
      });
      updateCard(res.data);
      setCard((prev) => (prev ? { ...prev, description } : prev));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdatePriority(priority: string) {
    if (!card) return;
    try {
      const res = await api.put<{ data: Card }>(`/cards/${card.id}`, {
        priority,
      });
      updateCard(res.data);
      setCard((prev) =>
        prev ? { ...prev, priority: res.data.priority } : prev
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddComment() {
    if (!card || !comment.trim()) return;
    try {
      const res = await api.post<{
        data: Comment & {
          user: { id: string; name: string; email: string };
        };
      }>(`/cards/${card.id}/comments`, { content: comment });
      addComment(res.data);
      setCard((prev) =>
        prev ? { ...prev, comments: [...prev.comments, res.data] } : prev
      );
      setComment("");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!card) return;
    try {
      await api.delete(`/cards/${card.id}/comments/${commentId}`);
      deleteComment(commentId);
      setCard((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.filter((c) => c.id !== commentId),
            }
          : prev
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAssignTag(tagId: string) {
    if (!card) return;
    const alreadyAssigned = card.tags.some((t) => t.id === tagId);
    if (alreadyAssigned) return;
    try {
      await api.post(`/cards/${card.id}/tags/${tagId}`, {});
      const tag = allTags.find((t) => t.id === tagId);
      if (tag) {
        setCard((prev) =>
          prev ? { ...prev, tags: [...prev.tags, tag] } : prev
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemoveTag(tagId: string) {
    if (!card) return;
    try {
      await api.delete(`/cards/${card.id}/tags/${tagId}`);
      setCard((prev) =>
        prev ? { ...prev, tags: prev.tags.filter((t) => t.id !== tagId) } : prev
      );
    } catch (err) {
      console.error(err);
    }
  }

  const tagColorMap: Record<string, string> = {
    RED: "bg-red-500",
    BLUE: "bg-blue-500",
    GREEN: "bg-green-500",
    YELLOW: "bg-yellow-500",
    PURPLE: "bg-purple-500",
    ORANGE: "bg-orange-500",
    PINK: "bg-pink-500",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle />
        {loading || !card ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="space-y-6">
            <DialogHeader>
              {editingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleUpdateTitle}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdateTitle()}
                  autoFocus
                />
              ) : (
                <DialogTitle
                  className="cursor-pointer hover:underline"
                  onClick={() => setEditingTitle(true)}
                >
                  {card.title}
                </DialogTitle>
              )}
            </DialogHeader>

            <div className="space-y-2">
              <p className="text-sm font-medium">Priority</p>
              <Select
                value={card.priority}
                onValueChange={handleUpdatePriority}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Description</p>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleUpdateDescription}
                placeholder="Add a description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Tags</p>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    className={`${tagColorMap[tag.color]} text-white cursor-pointer`}
                    onClick={() => handleRemoveTag(tag.id)}
                  >
                    {tag.name} ✕
                  </Badge>
                ))}
              </div>
              <Select onValueChange={handleAssignTag}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add tag..." />
                </SelectTrigger>
                <SelectContent>
                  {allTags
                    .filter((t) => !card.tags.some((ct) => ct.id === t.id))
                    .map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${tagColorMap[tag.color]}`}
                          />
                          {tag.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Comments</p>
              <div className="space-y-3">
                {card.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                      {c.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{c.user.name}</p>
                        {c.userId === user?.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleDeleteComment(c.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {c.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  placeholder="Write a comment..."
                  className="flex-1"
                />
                <Button onClick={handleAddComment}>Post</Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
