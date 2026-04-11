import { prisma } from "@repo/db";

export const tagService = {
  async getAllTags() {
    return await prisma.tag.findMany();
  },

  async createTag(name: string, color: string) {
    return await prisma.tag.create({
      data: { name, color },
    });
  },

  async assignTag(userId: string, cardId: string, tagId: string) {
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
        tags: { connect: { id: tagId } },
      },
    });
  },

  async removeTag(userId: string, cardId: string, tagId: string) {
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
        tags: { disconnect: { id: tagId } },
      },
    });
  },
};
