import { prisma } from "@repo/db";
import { AppError } from "../middleware/errorMiddleware";

export const boardService = {
  async getAllBoards(userId: string) {
    const boards = await prisma.board.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return boards;
  },

  async getBoardById(boardId: string, userId: string) {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        columns: {
          include: {
            cards: {
              include: {
                assignee: {
                  select: { id: true, name: true, email: true },
                },
                tags: true,
              },
            },
          },
        },
      },
    });
    if (!board) {
      throw new AppError("Board not found", 400);
    }
    const isBoardMember = board.members.some((x) => x.userId === userId);
    if (!isBoardMember) {
      throw new AppError("Access denied", 403);
    }
    return board;
  },

  async createBoard(userId: string, title: string, description?: string) {
    const newBoard = await prisma.board.create({
      data: {
        title,
        description,
        members: {
          create: {
            userId: userId,
            role: "OWNER",
          },
        },
      },
    });
    return newBoard;
  },

  async updateBoard(
    boardId: string,
    userId: string,
    data: { title?: string; description?: string }
  ) {
    const member = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId, boardId } },
    });
    if (!member) {
      throw new AppError("Access denied", 403);
    }
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: data,
    });
    return updatedBoard;
  },

  async deleteBoard(userId: string, boardId: string) {
    const member = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId, boardId } },
    });
    if (!member) {
      throw new AppError("Access denied", 403);
    }
    if (member.role !== "OWNER") {
      throw new AppError("Only the board owner can delete a board", 403);
    }
    await prisma.board.delete({
      where: { id: boardId },
    });
  },
};
