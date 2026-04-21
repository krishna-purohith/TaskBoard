"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Board } from "@repo/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpinnerCustom } from "@/components/SpinnerCustom";
import Link from "next/link";

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    async function fetchBoards() {
      try {
        const boards = await api.get<Board[]>("/boards");

        setBoards(boards);
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          setFetchError(e.message);
        }
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
      console.log("while creating. the board");
      const res = await api.post<Board>("/boards", {
        title,
        description,
      });
      setBoards((prev) => [...prev, res]);
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

  if (fetchError)
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-destructive">{fetchError}</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
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
              disabled={creating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              disabled={creating}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create Board"}
          </Button>
        </form>
      )}

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <p className="text-muted-foreground">No boards yet.</p>
          <p className="text-sm text-muted-foreground">
            Create your first board to get started.
          </p>
          <Button onClick={() => setShowForm(true)}>
            Create your first board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <Link href={`/boards/${board.id}`} key={board.id}>
              <div className="bg-secondary/70 border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors space-y-2 hover:shadow-xs shadow-foreground">
                <h3 className="font-semibold text-lg">{board.title}</h3>
                {board.description && (
                  <p className="text-sm text-muted-foreground">
                    {board.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
