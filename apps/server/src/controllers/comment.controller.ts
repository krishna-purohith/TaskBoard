import { NextFunction, Request, Response } from "express";
import { createCommentSchema } from "../types/requestSchemas";
import { commentService } from "../services/comment.service";
import { zodCustomErroFormat } from "../types/zodErrorFormat";
import { broadcastToBoard } from "../ws/wsServer";

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
      const { boardId, comment } = await commentService.addComment(
        req.user!.id,
        req.params.cardId as string,
        parsed.data.content
      );
      broadcastToBoard(boardId, { type: "COMMENT_ADDED", comment });
      res.status(201).json({ data: comment, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { boardId, commentId } = await commentService.deleteComment(
        req.user!.id,
        req.params.commentId as string
      );
      broadcastToBoard(boardId, { type: "COMMENT_DELETED", commentId });
      res.status(200).json({ success: true, data: null, error: null });
    } catch (error) {
      next(error);
    }
  },
};
