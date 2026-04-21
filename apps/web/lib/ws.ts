import { WSClientEvent, WSServerEvent } from "@repo/types";
import { useBoardStore } from "@/app/stores/boardStore";
import { useAuthStore } from "@/app/stores/authStore";
import { toast } from "sonner";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

let ws: WebSocket | null = null;
let currentBoardId: string | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

function send(event: WSClientEvent) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(event));
  }
}

function handleEvent(event: WSServerEvent) {
  const store = useBoardStore.getState();

  switch (event.type) {
    case "CARD_CREATED":
      store.addCard(event.card);
      break;
    case "CARD_UPDATED":
      store.updateCard(event.card);
      break;
    case "CARD_DELETED":
      store.deleteCard(event.cardId);
      break;
    case "COLUMN_CREATED":
      store.addColumn(event.column);
      break;
    case "COLUMN_UPDATED":
      store.updateColumn(event.column);
      break;
    case "COLUMN_DELTED":
      store.deleteColumn(event.columnId);
      break;
    case "COMMENT_ADDED":
      store.addComment(event.comment);
      break;
    case "COMMENT_DELETED":
      store.deleteComment(event.commentId);
      break;
    case "MEMBER_ADDED":
      store.addMember(event.member);
      break;
    case "MEMBER_REMOVED": {
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.id === event.memberId) {
        disconnectWs();
        useBoardStore.getState().clearBoard();
        toast.error("You have been removed from this board", {
          duration: 5000,
          onDismiss: () => {
            window.location.href = "/dashboard";
          },
        });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 5000);
      } else {
        store.removeMember(event.memberId);
      }
      break;
    }
  }
}

function scheduleReconnect() {
  if (reconnectTimeout) return;
  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    if (currentBoardId) {
      console.log("Reconnecting...");
      connectWs(currentBoardId);
    }
  }, 3000);
}

export function connectWs(boardId: string) {
  if (ws?.readyState === WebSocket.OPEN) return;

  currentBoardId = boardId;
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("WS connected");
    send({ type: "JOIN_BOARD", boardId });
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as WSServerEvent;
      handleEvent(data);
    } catch {
      console.error("WS message parse error");
    }
  };

  ws.onclose = (event) => {
    console.log("socket disconted", event.code, event.reason);
    console.log("WS disconnected, reconnecting...");
    scheduleReconnect();
  };

  ws.onerror = (err) => {
    console.error("WS error", err);
  };
}

export function disconnectWs() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  if (ws) {
    if (currentBoardId) {
      send({ type: "LEAVE_BOARD", boardId: currentBoardId });
    }
    ws.close();
    ws = null;
    currentBoardId = null;
  }
}
