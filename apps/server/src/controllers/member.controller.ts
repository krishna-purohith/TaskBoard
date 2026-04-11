import { Request, Response } from "express";
import { addMemberSchema } from "../types/requestSchemas";
import { memberService } from "../services/member.service";

export const memberController = {
  async addMember(req: Request, res: Response) {
    try {
      const parsed = addMemberSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
      }
      const member = await memberService.addMember(
        req.user!.id,
        req.params.boardId as string,
        parsed.data.email,
        parsed.data.role
      );
      res.status(201).json({ member });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async removeMember(req: Request, res: Response) {
    try {
      await memberService.removeMember(
        req.user!.id,
        req.params.boardId as string,
        req.params.userId as string
      );
      res.status(200).json({ message: "Member removed" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
