import { Request, Response } from "express";
import { boardService } from "../services/board.service";
import { createBoardSchema, updateBoardSchema } from "../types/requestSchemas";

export const boardController = {
  async getAllBoards(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const boards = await boardService.getAllBoards(userId);
      res.status(200).json({
        boards,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }
      res.status(500).json({ error: "Internal server errror" });
    }
  },

  async getBoardById(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const boardId = req.params.id;
      const board = await boardService.getBoardById(boardId, userId);
      res.status(200).json({
        board,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }
      res.status(500).json({ error: "Internal server errror" });
    }
  },

  async createBoard(req: Request, res: Response) {
    try {
      const parsed = createBoardSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }
      const board = await boardService.createBoard(
        req.user!.id,
        parsed.data.title,
        parsed.data.description
      );
      res.status(201).json({ board });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }
      res.status(500).json({ error: "Internal server errror" });
    }
  },
  async updateBoard(req: Request, res: Response) {
    try {
      const parsed = updateBoardSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }
      const board = await boardService.updateBoard(
        req.params.id,
        req.user!.id,
        parsed.data
      );
      res.status(201).json({ board });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }
      res.status(500).json({ error: "Internal server errror" });
    }
  },

  async deleteBoard(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const boardId = req.params.boardId;
      if (!boardId) {
        res.status(400).json({ error: "baordid is required" });
      }
      await boardService.deleteBoard(userId, boardId);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
