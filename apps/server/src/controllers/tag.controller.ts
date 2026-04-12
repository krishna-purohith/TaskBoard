import { NextFunction, Request, Response } from "express";
import { tagService } from "../services/tags.service";
import { createTagSchema } from "../types/requestSchemas";
import { zodCustomErroFormat } from "../types/zodErrorFormat";

export const tagsController = {
  async getAllTags(_req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await tagService.getAllTags();
      res.status(200).json({ data: tags, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },

  async createTag(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createTagSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: zodCustomErroFormat(parsed.error),
          data: null,
          success: false,
        });
        return;
      }
      const tag = await tagService.createTag(
        parsed.data.name,
        parsed.data.color
      );
      res.status(201).json({ data: tag, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },

  async assignTag(req: Request, res: Response, next: NextFunction) {
    try {
      const card = await tagService.assignTag(
        req.user!.id,
        req.params.cardId as string,
        req.params.tagId as string
      );
      res.status(200).json({ data: card, error: null, success: true });
    } catch (error) {
      next(error);
    }
  },

  async removeTag(req: Request, res: Response, next: NextFunction) {
    try {
      const card = await tagService.removeTag(
        req.user!.id,
        req.params.cardId as string,
        req.params.tagId as string
      );
      res.status(200).json({ data: card, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },
};
