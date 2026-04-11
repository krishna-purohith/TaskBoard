import { prisma } from "@repo/db";

export const commentService = {
  async addComment(userId: string, cardId: string, content: string) {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        column: { include: { board: { include: { members: true } } } },
      },
    });

    if (!card) throw new Error("Card not found");

    const isMember = card.column.board.members.some((m) => m.userId === userId);
    if (!isMember) throw new Error("Access denied");

    return await prisma.comment.create({
      data: { content, cardId, userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async deleteComment(userId: string, commentId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== userId)
      throw new Error("You can only delete your own comments");

    await prisma.comment.delete({ where: { id: commentId } });
  },
};
