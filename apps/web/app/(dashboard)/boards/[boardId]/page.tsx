"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { BoardWithRelations, useBoardStore } from "@/app/stores/boardStore";
import { connectWs, disconnectWs } from "@/lib/ws";
import BoardView from "@/components/BoardView";
import { SpinnerCustom } from "@/components/SpinnerCustom";

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();

  const board = useBoardStore((state) => state.board);
  const [error, setError] = useState("");

  useEffect(() => {
    const { setBoard, clearBoard } = useBoardStore.getState();

    async function fetchBoard() {
      try {
        const board = await api.get<BoardWithRelations>(`/boards/${boardId}`);
        setBoard(board);
        connectWs(boardId);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }

    fetchBoard();

    return () => {
      disconnectWs();
      clearBoard();
    };
  }, [boardId]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!board)
    return (
      <div className="flex-1 flex items-center justify-center">
        <SpinnerCustom loadingMessage="Loading board details..." />
      </div>
    );

  return <BoardView />;
}
