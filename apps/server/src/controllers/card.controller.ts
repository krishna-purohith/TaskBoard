import { NextFunction, Request, Response } from "express";
import { cardService } from "../services/card.service";
import { createCardSchema, updateCardSchema } from "../types/requestSchemas";
import { zodCustomErroFormat } from "../types/zodErrorFormat";

export const cardsController = {
  async getCardById(req: Request, res: Response, next: NextFunction) {
    try {
      const card = await cardService.getCardById(
        req.user!.id,
        req.params.id as string
      );
      res.status(200).json({ data: card, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },

  async createCard(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createCardSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: zodCustomErroFormat(parsed.error),
          data: null,
          success: false,
        });
        return;
      }
      const card = await cardService.createCard(req.user!.id, parsed.data);
      res.status(201).json({ card });
    } catch (error) {
      next(error);
    }
  },

  async updateCard(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateCardSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: zodCustomErroFormat(parsed.error),
          data: null,
        });
        return;
      }
      const card = await cardService.updateCard(
        req.user!.id,
        req.params.id as string,
        parsed.data
      );
      res.status(200).json({ data: card, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },

  async deleteCard(req: Request, res: Response, next: NextFunction) {
    try {
      await cardService.deleteCard(req.user!.id, req.params.id as string);
      res.status(204).json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};
