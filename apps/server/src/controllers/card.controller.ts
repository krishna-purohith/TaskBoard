import { NextFunction, Request, Response } from "express";
import { cardService } from "../services/card.service";
import { createCardSchema, updateCardSchema } from "../types/requestSchemas";
import { zodCustomErroFormat } from "../types/zodErrorFormat";
import { broadcastToBoard } from "../ws/wsServer";
import { boardService } from "../services/board.service";
import { prisma } from "@repo/db";
import { AppError } from "../middleware/errorMiddleware";

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
      broadcastToBoard(
        card.boardId,
        { type: "CARD_CREATED", card },
        req.user!.id
      );
      res.status(201).json({ data: card, success: true, error: null });
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
      const updatedCard = await cardService.updateCard(
        req.user!.id,
        req.params.id as string,
        parsed.data
      );

      broadcastToBoard(updatedCard.boardId, {
        type: "CARD_UPDATED",
        card: updatedCard,
      });

      res.status(200).json({ data: updatedCard, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },

  async deleteCard(req: Request, res: Response, next: NextFunction) {
    try {
      const card = await cardService.deleteCard(
        req.user!.id,
        req.params.id as string
      );

      broadcastToBoard(card.boardId, { type: "CARD_DELETED", cardId: card.id });

      res.status(200).json({ success: true, data: null, error: null });
    } catch (error) {
      next(error);
    }
  },
};
