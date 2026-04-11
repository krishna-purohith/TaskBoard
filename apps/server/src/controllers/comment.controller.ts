import { Request, Response } from "express";
import { createCommentSchema } from "../types/requestSchemas";
import { commentService } from "../services/comment.service";

export const commentsController = {
  async addComment(req: Request, res: Response) {
    try {
      const parsed = createCommentSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
      }
      const comment = await commentService.addComment(
        req.user!.id,
        req.params.cardId,
        parsed.data.content
      );
      res.status(201).json({ comment });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async deleteComment(req: Request, res: Response) {
    try {
      await commentService.deleteComment(req.user!.id, req.params.commentId);
      res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
