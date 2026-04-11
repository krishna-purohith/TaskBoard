import { prisma } from "@repo/db";
import { CreateCardInput, UpdateCardInput } from "../types/requestSchemas";

export const cardService = {
  async createCard(userId: string, data: CreateCardInput) {
    const column = await prisma.column.findUnique({
      where: { id: data.columnId },
      include: { board: { include: { members: true } } },
    });

    if (!column) throw new Error("Column not found");

    const isMember = column.board.members.some((m) => m.userId === userId);
    if (!isMember) throw new Error("Access denied");

    return await prisma.card.create({
      data: {
        title: data.title,
        columnId: data.columnId,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assigneeId: data.assigneeId,
      },
    });
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

    if (!card) throw new Error("Card not found");

    const isMember = card.column.board.members.some((m) => m.userId === userId);
    if (!isMember) throw new Error("Access denied");

    return card;
  },

  async updateCard(userId: string, cardId: string, data: UpdateCardInput) {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        column: { include: { board: { include: { members: true } } } },
      },
    });

    if (!card) throw new Error("Card not found");

    const isMember = card.column.board.members.some((m) => m.userId === userId);
    if (!isMember) throw new Error("Access denied");

    return await prisma.card.update({
      where: { id: cardId },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });
  },

  async deleteCard(userId: string, cardId: string) {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        column: { include: { board: { include: { members: true } } } },
      },
    });

    if (!card) throw new Error("Card not found");

    const isMember = card.column.board.members.some((m) => m.userId === userId);
    if (!isMember) throw new Error("Access denied");

    await prisma.card.delete({ where: { id: cardId } });
  },
};
