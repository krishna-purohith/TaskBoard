import { create } from "zustand";
import { Board, Column, Card, Comment, BoardMember, Tag } from "@repo/db";
import { BoardMemberWithUser } from "@repo/types";

interface BoardWithRelations extends Board {
  columns: (Column & {
    cards: (Card & {
      tags?: Tag[];
      assignee?: { id: string; name: string; email: string } | null;
    })[];
  })[];
  members: BoardMemberWithUser[];
}

interface BoardStore {
  board: BoardWithRelations | null;
  setBoard: (board: BoardWithRelations) => void;
  clearBoard: () => void;

  addColumn: (column: Column) => void;
  updateColumn: (column: Column) => void;
  deleteColumn: (columnId: string) => void;

  addCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  deleteCard: (cardId: string) => void;

  addComment: (comment: Comment) => void;
  deleteComment: (commentId: string) => void;

  addMember: (member: BoardWithRelations["members"][0]) => void;
  removeMember: (userId: string) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: null,

  setBoard(board) {
    set({ board });
  },

  clearBoard() {
    set({ board: null });
  },

  addColumn(column) {
    set((state) => {
      if (!state.board) return state;
      return {
        board: {
          ...state.board,
          columns: [...state.board.columns, { ...column, cards: [] }],
        },
      };
    });
  },

  updateColumn(column) {
    set((state) => {
      if (!state.board) return state;
      return {
        board: {
          ...state.board,
          columns: state.board.columns.map((col) =>
            col.id === column.id ? { ...col, ...column } : col
          ),
        },
      };
    });
  },

  deleteColumn(columnId) {
    set((state) => {
      if (!state.board) return state;
      return {
        board: {
          ...state.board,
          columns: state.board.columns.filter((col) => col.id !== columnId),
        },
      };
    });
  },

  addCard(card) {
    set((state) => {
      if (!state.board) return state;
      return {
        board: {
          ...state.board,
          columns: state.board.columns.map((col) =>
            col.id === card.columnId
              ? { ...col, cards: [...col.cards, card] }
              : col
          ),
        },
      };
    });
  },

  updateCard(card) {
    set((state) => {
      if (!state.board) return state;
      return {
        board: {
          ...state.board,
          columns: state.board.columns.map((col) => ({
            ...col,
            cards: col.cards.map((c) => (c.id === card.id ? card : c)),
          })),
        },
      };
    });
  },

  deleteCard(cardId) {
    set((state) => {
      if (!state.board) return state;
      return {
        board: {
          ...state.board,
          columns: state.board.columns.map((col) => ({
            ...col,
            cards: col.cards.filter((c) => c.id !== cardId),
          })),
        },
      };
    });
  },

  addComment(comment) {
    set((state) => {
      if (!state.board) return state;
      return {
        board: {
          ...state.board,
          columns: state.board.columns.map((col) => ({
            ...col,
            cards: col.cards.map((card) =>
              card.id === comment.cardId
                ? {
                    ...card,
                    comments: [...((card as any).comments ?? []), comment],
                  }
                : card
            ),
          })),
        },
      };
    });
  },

  deleteComment(commentId) {
    set((state) => {
      if (!state.board) return state;
      return {
        board: {
          ...state.board,
          columns: state.board.columns.map((col) => ({
            ...col,
            cards: col.cards.map((card) => ({
              ...card,
              comments:
                (card as any).comments?.filter(
                  (c: Comment) => c.id !== commentId
                ) ?? [],
            })),
          })),
        },
      };
    });
  },

  addMember(member) {
    set((state) => {
      if (!state.board) return state;
      return {
        board: {
          ...state.board,
          members: [...state.board.members, member],
        },
      };
    });
  },

  removeMember(userId) {
    set((state) => {
      if (!state.board) return state;
      return {
        board: {
          ...state.board,
          members: state.board.members.filter((m) => m.userId !== userId),
        },
      };
    });
  },
}));
