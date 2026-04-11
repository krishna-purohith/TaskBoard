import { Request, Response } from "express";
import { cardService } from "../services/card.service";
import { createCardSchema, updateCardSchema } from "../types/requestSchemas";

export const cardsController = {
  async getCardById(req: Request, res: Response) {
    try {
      const card = await cardService.getCardById(req.user!.id, req.params.id);
      res.status(200).json({ card });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async createCard(req: Request, res: Response) {
    try {
      const parsed = createCardSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
      }
      const card = await cardService.createCard(req.user!.id, parsed.data);
      res.status(201).json({ card });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async updateCard(req: Request, res: Response) {
    try {
      const parsed = updateCardSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
      }
      const card = await cardService.updateCard(
        req.user!.id,
        req.params.id,
        parsed.data
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

  async deleteCard(req: Request, res: Response) {
    try {
      await cardService.deleteCard(req.user!.id, req.params.id);
      res.status(200).json({ message: "Card deleted" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
