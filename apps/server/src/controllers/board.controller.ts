import { NextFunction, Request, Response } from "express";
import { boardService } from "../services/board.service";
import { createBoardSchema, updateBoardSchema } from "../types/requestSchemas";
import { zodCustomErroFormat } from "../types/zodErrorFormat";

export const boardController = {
  async getAllBoards(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const boards = await boardService.getAllBoards(userId);
      res.status(200).json({
        data: boards,
        success: true,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },

  async getBoardById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const boardId = req.params.id as string;
      const board = await boardService.getBoardById(boardId, userId);
      res.status(200).json({
        data: board,
        success: true,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },

  async createBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createBoardSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: zodCustomErroFormat(parsed.error),
          success: false,
          data: null,
        });
        return;
      }
      const board = await boardService.createBoard(
        req.user!.id,
        parsed.data.title,
        parsed.data.description
      );
      res.status(201).json({ data: board, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },
  async updateBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateBoardSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: zodCustomErroFormat(parsed.error),
          data: null,
          success: false,
        });
        return;
      }
      const board = await boardService.updateBoard(
        req.params.id as string,
        req.user!.id,
        parsed.data
      );
      res.status(200).json({ data: board, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },

  async deleteBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const boardId = req.params.id as string;
      await boardService.deleteBoard(userId, boardId);
      res.status(200).json({ success: true, data: null, error: null });
    } catch (error) {
      next(error);
    }
  },
};
