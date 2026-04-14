import { NextFunction, Request, Response } from "express";
import { loginSchema, signupSchema } from "../types/requestSchemas";
import { authService } from "../services/auth.service";
import { zodCustomErroFormat } from "../types/zodErrorFormat";
import { success } from "zod";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // secure: true,
  sameSite: "lax" as const,
  maxAge: 1000 * 60 * 60 * 7,
};

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: zodCustomErroFormat(parsed.error),
        data: null,
        success: false,
      });
    }
    const { email, password, name } = parsed.data;
    try {
      const { token, user } = await authService.signup(name, email, password);
      res.cookie("token", token, cookieOptions);

      res.status(201).json({
        data: user,
        success: true,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: zodCustomErroFormat(parsed.error),
          data: null,
          success: false,
        });
        return;
      }
      const { email, password } = parsed.data;
      const { token, user } = await authService.login(email, password);
      res.cookie("token", token, cookieOptions);
      res.status(200).json({ data: user, success: true, error: null });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response) {
    res.clearCookie("token");
    res.status(200).json({ data: "Logged out", success: true, error: null });
  },
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.me(req.user!.id);

      res.status(200).json({ data: user, sucess: true, error: null });
    } catch (error) {
      next(error);
    }
  },
};
