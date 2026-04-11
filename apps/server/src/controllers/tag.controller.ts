import { Request, Response } from "express";
import { tagService } from "../services/tags.service";
import { createTagSchema } from "../types/requestSchemas";

export const tagsController = {
  async getAllTags(_req: Request, res: Response) {
    try {
      const tags = await tagService.getAllTags();
      res.status(200).json({ tags });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async createTag(req: Request, res: Response) {
    try {
      const parsed = createTagSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
      }
      const tag = await tagService.createTag(
        parsed.data.name,
        parsed.data.color
      );
      res.status(201).json({ tag });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async assignTag(req: Request, res: Response) {
    try {
      const card = await tagService.assignTag(
        req.user!.id,
        req.params.cardId,
        req.params.tagId
      );
      res.status(200).json({ card });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async removeTag(req: Request, res: Response) {
    try {
      const card = await tagService.removeTag(
        req.user!.id,
        req.params.cardId,
        req.params.tagId
      );
      res.status(200).json({ card });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
