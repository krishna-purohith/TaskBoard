import { NextFunction, Request, Response } from "express";
import { createCommentSchema } from "../types/requestSchemas";
import { commentService } from "../services/comment.service";
import { zodCustomErroFormat } from "../types/zodErrorFormat";

export const commentsController = {
  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createCommentSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: zodCustomErroFormat(parsed.error),
          data: null,
        });
        return;
      }
      const comment = await commentService.addComment(
        req.user!.id,
        req.params.cardId as string,
        parsed.data.content
      );
      res.status(201).json({ data: comment, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      await commentService.deleteComment(
        req.user!.id,
        req.params.commentId as string
      );
      res.status(204).json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};
