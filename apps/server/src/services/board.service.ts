import { prisma } from "@repo/db";

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
              },
            },
          },
        },
      },
    });
    if (!board) {
      throw new Error("Board not found");
    }
    const isBoardMember = board.members.some((x) => x.userId === userId);
    if (!isBoardMember) {
      throw new Error("Access denied");
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
      throw new Error("Access denied");
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
      throw new Error("Access denied");
    }
    if (member.role !== "OWNER") {
      throw new Error("Only the board owner can delete a board");
    }
    await prisma.board.delete({
      where: { id: boardId },
    });
  },

  //   async getBoardwithfullDetails(userId: string, boardId: string) {
  //     const allboardsWithDetails = await prisma.board.findMany({
  //       where: {
  //         members: {
  //           some: {
  //             userId,
  //           },
  //         },
  //       },
  //       include: {
  //         columns: {
  //           include: {
  //             cards: {
  //               select: {
  //                 id: true,
  //                 title: true,
  //                 priority: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //   },
};
