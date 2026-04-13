import { prisma } from "@repo/db";
import { AppError } from "../middleware/errorMiddleware";

export const commentService = {
  async addComment(userId: string, cardId: string, content: string) {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        column: { include: { board: { include: { members: true } } } },
      },
    });

    if (!card) throw new AppError("Card not found", 400);

    const isMember = card.column.board.members.some((m) => m.userId === userId);
    if (!isMember) throw new AppError("Access denied", 403);

    const comment = await prisma.comment.create({
      data: { content, cardId, userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
    return { comment, boardId: card.column.boardId };
  },

  async deleteComment(userId: string, commentId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        card: {
          include: {
            column: true,
          },
        },
      },
    });

    if (!comment) throw new AppError("Comment not found", 400);
    if (comment.userId !== userId)
      throw new AppError("You can only delete your own comments", 403);

    await prisma.comment.delete({ where: { id: commentId } });
    comment.cardId;
    return { boardId: comment.card.column.boardId, commentId };
  },
};
