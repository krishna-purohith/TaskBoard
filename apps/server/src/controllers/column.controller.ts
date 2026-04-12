import { Request, Response } from "express";
import {
  createColumnSchema,
  updateColumnSchema,
} from "../types/requestSchemas";
import { columnService } from "../services/column.service";
import { zodCustomErroFormat } from "../types/zodErrorFormat";
export const columnController = {
  async createColumn(req: Request, res: Response) {
    try {
      const parsed = createColumnSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: zodCustomErroFormat(parsed.error),
        });
        return;
      }
      const column = await columnService.createColumn(
        req.user!.id,
        parsed.data.boardId,
        parsed.data.title
      );
      res.status(201).json({ column });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async updateColumn(req: Request, res: Response) {
    try {
      const parsed = updateColumnSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: zodCustomErroFormat(parsed.error) });
        return;
      }
      const column = await columnService.updateColumn(
        req.user!.id,
        req.params.id as string,
        parsed.data.title
      );
      res.status(200).json({ column });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async deleteColumn(req: Request, res: Response) {
    try {
      await columnService.deleteColumn(req.user!.id, req.params.id as string);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
