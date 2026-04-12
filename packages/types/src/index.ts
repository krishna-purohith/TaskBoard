import type { Card, Column, Comment, BoardMember, Board } from "@repo/db";

export type { Card, Column, Comment, BoardMember };

export type WSClientEvent =
  | { type: "JOIN_BOARD"; boardId: string }
  | { type: "LEAVE_BOARD"; boardId: string };

export type WSServerEvent =
  | { type: "CARD_CREATED"; card: Card }
  | { type: "CARD_UPDATED"; card: Card }
  | { type: "CARD_DELETED"; cardId: string }
  | { type: "COLUMN_CREATED"; column: Column }
  | { type: "COLUMN_UPDATED"; column: Column }
  | { type: "COLUMN_DELTED"; columnId: string }
  | { type: "COMMENT_ADDED"; comment: Comment }
  | { type: "COMMENT_DELETED"; commentId: string }
  | { type: "MEMBER_ADDED"; member: BoardMember }
  | { type: "MEMBER_REMOVED"; memberId: string };
