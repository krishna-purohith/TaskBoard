import { NextFunction, Request, Response } from "express";
import { usersService } from "../services/users.service";

export const userController = {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const users = await usersService.getAllUsers(userId);
      res.status(200).json({
        data: users,
        success: true,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
