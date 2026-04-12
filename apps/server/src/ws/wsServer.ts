import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { JWTPayload } from "../middleware/authMiddleware";
import { WSClientEvent, WSServerEvent } from "@repo/types";

interface AuthenticatedWebSocket extends WebSocket {
  userId: string;
  boardId?: string;
}
const rooms = new Map<string, Set<AuthenticatedWebSocket>>();

export function setupWsServer(wss: WebSocketServer) {
  wss.on("connection", (ws: AuthenticatedWebSocket, req: IncomingMessage) => {
    const cookies = parseCookies(req.headers.cookie || "");
    const token = cookies.token;
    if (!token) {
      ws.close(1008, "Unauthorized");
      return;
    }
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as JWTPayload;
      ws.userId = decoded.id;
    } catch (error) {
      ws.close(1008, "Invalid token");
      return;
    }
    console.log(`WS connected: ${ws.userId}`);

    ws.on("message", (data) => {
      try {
        const wsevent = JSON.parse(data.toString()) as WSClientEvent;
        handleClientEvent(ws, wsevent);
      } catch (error) {
        ws.send(JSON.stringify("Invalid msg format"));
      }
    });

    ws.on("close", (data) => {
      if (ws.boardId) {
        leaveRoom(ws, ws.boardId);
      }
      console.log(`WS disconnected: ${ws.userId}`);
    });
  });
}
function parseCookies(cookieHeader: string) {
  cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.split("=");
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>
  );
}
function handleClientEvent(ws: AuthenticatedWebSocket, event: WSClientEvent) {
  switch (event.type) {
    case "JOIN_BOARD":
      joinRoom(ws, event.boardId);

      break;
    case "LEAVE_BOARD":
      leaveRoom(ws, event.boardId);

      break;
  }
}

function joinRoom(ws: AuthenticatedWebSocket, boardId: string) {
  if (ws.boardId) {
    leaveRoom(ws, boardId);
  }
  if (!rooms.has(boardId)) {
    rooms.set(boardId, new Set());
  }
  rooms.get(boardId)!.add(ws);
  ws.boardId = boardId;
  console.log(`user ${ws.userId} has joined board ${ws.boardId}`);
}

function leaveRoom(ws: AuthenticatedWebSocket, boardId: string) {
  const room = rooms.get(boardId);
  if (room) {
    room.delete(ws);
    if (room.size === 0) {
      rooms.delete(boardId);
    }
  }
  ws.boardId = undefined;
  console.log(`user ${ws.userId} left board ${boardId}`);
}

export function broadcastToBoard(
  boardId: string,
  event: WSServerEvent,
  excludedUserId?: string
) {
  const room = rooms.get(boardId);
  if (!room) return;

  const message = JSON.stringify(event);

  room.forEach((socket) => {
    if (
      socket.readyState === WebSocket.OPEN &&
      socket.userId !== excludedUserId
    ) {
      socket.send(message);
    }
  });
}
