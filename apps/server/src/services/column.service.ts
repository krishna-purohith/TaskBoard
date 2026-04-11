import { prisma } from "@repo/db";

export const columnService = {
  async createColumn(userId: string, boardId: string, title: string) {
    const member = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId, boardId } },
    });

    if (!member) throw new Error("Access denied");

    return await prisma.column.create({
      data: { title, boardId },
    });
  },
  async updateColumn(userId: string, columnId: string, title: string) {
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: { board: { include: { members: true } } },
    });

    if (!column) throw new Error("Column not found");

    const isMember = column.board.members.some((m) => m.userId === userId);
    if (!isMember) throw new Error("Access denied");

    return await prisma.column.update({
      where: { id: columnId },
      data: { title },
    });
  },

  async deleteColumn(userId: string, columnId: string) {
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: { board: { include: { members: true } } },
    });

    if (!column) throw new Error("Column not found");

    const isMember = column.board.members.some((m) => m.userId === userId);
    if (!isMember) throw new Error("Access denied");

    await prisma.column.delete({ where: { id: columnId } });
  },
};
