import type { BoardMember, Card, Column, Comment } from "@repo/db";

export type { BoardMember, Card, Column, Comment };

export type WSClientEvent =
  | { type: "JOIN_BOARD"; boardId: string }
  | { type: "LEAVE_BOARD"; boardId: string };

export type BoardMemberWithUser = BoardMember & {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type WSServerEvent =
  | { type: "CARD_CREATED"; card: Card }
  | { type: "CARD_UPDATED"; card: Card }
  | { type: "CARD_DELETED"; cardId: string }
  | { type: "COLUMN_CREATED"; column: Column }
  | { type: "COLUMN_UPDATED"; column: Column }
  | { type: "COLUMN_DELTED"; columnId: string }
  | { type: "COMMENT_ADDED"; comment: Comment }
  | { type: "COMMENT_DELETED"; commentId: string }
  | { type: "MEMBER_ADDED"; member: BoardMemberWithUser }
  | { type: "MEMBER_REMOVED"; memberId: string };
