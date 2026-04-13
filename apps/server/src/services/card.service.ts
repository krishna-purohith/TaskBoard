import { prisma } from "@repo/db";
import { CreateCardInput, UpdateCardInput } from "../types/requestSchemas";
import { AppError } from "../middleware/errorMiddleware";

export const cardService = {
  async createCard(userId: string, data: CreateCardInput) {
    const column = await prisma.column.findUnique({
      where: { id: data.columnId },
      include: { board: { include: { members: true } } },
    });

    if (!column) throw new AppError("Column not found", 400);

    const isMember = column.board.members.some((m) => m.userId === userId);
    if (!isMember) throw new AppError("Access denied", 403);

    const card = await prisma.card.create({
      data: {
        title: data.title,
        columnId: data.columnId,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assigneeId: data.assigneeId,
      },
    });
    return { card, boardId: column.boardId };
  },

  async getCardById(userId: string, cardId: string) {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        tags: true,
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        column: {
          include: {
            board: { include: { members: true } },
          },
        },
      },
    });

    if (!card) throw new AppError("Card not found", 400);

    const isMember = card.column.board.members.some((m) => m.userId === userId);
    if (!isMember) throw new AppError("Access denied", 403);

    return card;
  },

  async updateCard(userId: string, cardId: string, data: UpdateCardInput) {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        column: { include: { board: { include: { members: true } } } },
      },
    });

    if (!card) throw new AppError("Card not found", 400);

    const isMember = card.column.board.members.some((m) => m.userId === userId);
    if (!isMember) throw new AppError("Access denied", 403);

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });
    return { boardId: card.column.boardId, updatedCard };
  },

  async deleteCard(userId: string, cardId: string) {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        column: { include: { board: { include: { members: true } } } },
      },
    });

    if (!card) throw new AppError("Card not found", 400);

    const isMember = card.column.board.members.some((m) => m.userId === userId);
    if (!isMember) throw new AppError("Access denied", 403);

    await prisma.card.delete({ where: { id: cardId } });
    return { boardId: card.column.boardId, card };
  },
};
