import { prisma } from "@repo/db";

export const usersService = {
  async getAllUsers(excludeUserId: string) {
    return await prisma.user.findMany({
      where: { id: { not: excludeUserId } },
      select: { id: true, name: true, email: true },
    });
  },
};
