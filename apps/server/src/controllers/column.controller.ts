import { NextFunction, Request, Response } from "express";
import {
  createColumnSchema,
  updateColumnSchema,
} from "../types/requestSchemas";
import { columnService } from "../services/column.service";
import { zodCustomErroFormat } from "../types/zodErrorFormat";
import { broadcastToBoard } from "../ws/wsServer";
export const columnController = {
  async createColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createColumnSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: zodCustomErroFormat(parsed.error),
          data: null,
          success: false,
        });
        return;
      }
      const column = await columnService.createColumn(
        req.user!.id,
        parsed.data.boardId,
        parsed.data.title
      );
      broadcastToBoard(column.boardId, { type: "COLUMN_CREATED", column });
      res.status(201).json({ data: column, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },
  async updateColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateColumnSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: zodCustomErroFormat(parsed.error),
          data: null,
          success: false,
        });
        return;
      }
      const column = await columnService.updateColumn(
        req.user!.id,
        req.params.id as string,
        parsed.data.title
      );
      broadcastToBoard(column.boardId, { type: "COLUMN_UPDATED", column });
      res.status(200).json({ data: column, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },
  async deleteColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const column = await columnService.deleteColumn(
        req.user!.id,
        req.params.id as string
      );
      broadcastToBoard(column.boardId, {
        type: "COLUMN_DELTED",
        columnId: column.id,
      });
      res.status(200).json({ success: true, data: null, error: null });
    } catch (error) {
      next(error);
    }
  },
};
