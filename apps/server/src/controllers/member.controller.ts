import { NextFunction, Request, Response } from "express";
import { addMemberSchema } from "../types/requestSchemas";
import { memberService } from "../services/member.service";
import { zodCustomErroFormat } from "../types/zodErrorFormat";

export const memberController = {
  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = addMemberSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: zodCustomErroFormat(parsed.error),
          data: null,
          success: false,
        });
        return;
      }
      const member = await memberService.addMember(
        req.user!.id,
        req.params.boardId as string,
        parsed.data.email,
        parsed.data.role
      );
      res.status(201).json({ data: member, error: null, success: true });
    } catch (error) {
      next(error);
    }
  },

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      await memberService.removeMember(
        req.user!.id,
        req.params.boardId as string,
        req.params.userId as string
      );
      res
        .status(200)
        .json({ data: "Member removed", error: null, success: true });
    } catch (error) {
      next(error);
    }
  },
};
