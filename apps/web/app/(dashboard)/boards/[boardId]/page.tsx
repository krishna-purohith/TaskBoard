"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { BoardWithRelations, useBoardStore } from "@/app/stores/boardStore";
import { connectWs, disconnectWs } from "@/lib/ws";
import BoardView from "@/components/BoardView";

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();

  const board = useBoardStore((state) => state.board);

  useEffect(() => {
    const { setBoard, clearBoard } = useBoardStore.getState();

    async function fetchBoard() {
      try {
        const board = await api.get<BoardWithRelations>(`/boards/${boardId}`);
        setBoard(board);
        connectWs(boardId);
      } catch (err) {
        console.error(err);
      }
    }

    fetchBoard();

    return () => {
      disconnectWs();
      clearBoard();
    };
  }, [boardId]);

  if (!board)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading board...</p>
      </div>
    );

  return <BoardView />;
}
