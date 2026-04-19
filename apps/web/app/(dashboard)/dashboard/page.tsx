"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Board } from "@repo/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpinnerCustom } from "@/components/SpinnerCustom";

export default function BoardsPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBoards() {
      console.log("fetching boards...");
      try {
        const res = await api.get<{ data: Board[] }>("/boards");
        console.log("boards response:", res);
        setBoards(res.data);
      } catch (err) {
        console.log("boards error:", err);
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBoards();
  }, []);

  async function handleCreateBoard(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post<{ data: Board }>("/boards", {
        title,
        description,
      });
      setBoards((prev) => [...prev, res.data]);
      setTitle("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center ">
        <SpinnerCustom loadingMessage="Loading Boards..." />
      </div>
    );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-primary font-bold">Your Boards</h2>
        <Button
          className="cursor-pointer"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "New Board"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateBoard}
          className="border rounded-lg p-6 space-y-4 max-w-md"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Board"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create Board"}
          </Button>
        </form>
      )}

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">No boards yet.</p>
          <p className="text-sm text-muted-foreground">
            Create your first board to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => router.push(`/boards/${board.id}`)}
              className="border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow space-y-2"
            >
              <h3 className="font-semibold text-lg">{board.title}</h3>
              {board.description && (
                <p className="text-sm text-muted-foreground">
                  {board.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
