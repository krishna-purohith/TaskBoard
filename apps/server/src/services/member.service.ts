import { prisma } from "@repo/db";

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

    if (!ownerMembership) throw new Error("Access denied");
    if (ownerMembership.role !== "OWNER")
      throw new Error("Only owners can add members");

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) throw new Error("User not found");

    const existing = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId: userToAdd.id, boardId } },
    });
    if (existing) throw new Error("User is already a member");

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

    if (!ownerMembership) throw new Error("Access denied");
    if (ownerMembership.role !== "OWNER")
      throw new Error("Only owners can remove members");
    if (ownerId === userId) throw new Error("Owner cannot remove themselves");

    const member = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId, boardId } },
    });
    console.log("Member: ", member);
    if (!member) throw new Error("Member not found");

    await prisma.boardMember.delete({
      where: { userId_boardId: { userId, boardId } },
    });
  },
};
