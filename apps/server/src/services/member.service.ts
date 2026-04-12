import { prisma } from "@repo/db";
import { AppError } from "../middleware/errorMiddleware";

export const memberService = {
  async addMember(
    ownerId: string,
    boardId: string,
    email: string,
    role: "OWNER" | "MEMBER"
  ) {
    const ownerMembership = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId: ownerId, boardId } },
    });

    if (!ownerMembership) throw new AppError("Access denied", 403);
    if (ownerMembership.role !== "OWNER")
      throw new AppError("Only owners can add members", 403);

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) throw new AppError("User not found", 400);

    const existing = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId: userToAdd.id, boardId } },
    });
    if (existing) throw new AppError("User is already a member", 400);

    return await prisma.boardMember.create({
      data: { userId: userToAdd.id, boardId, role },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async removeMember(ownerId: string, boardId: string, userId: string) {
    const ownerMembership = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId: ownerId, boardId } },
    });

    if (!ownerMembership) throw new AppError("Access denied", 403);
    if (ownerMembership.role !== "OWNER")
      throw new AppError("Only owners can remove members", 403);
    if (ownerId === userId)
      throw new AppError("Owner cannot remove themselves", 403);

    const member = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId, boardId } },
    });
    console.log("Member: ", member);
    if (!member) throw new AppError("Member not found", 400);

    await prisma.boardMember.delete({
      where: { userId_boardId: { userId, boardId } },
    });
  },
};
