import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../types/requestSchemas";
import { authService } from "../services/auth.service";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  maxAge: 1000 * 60 * 60 * 7,
};

export const authController = {
  async signup(req: Request, res: Response) {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "All fields requried.",
      });
    }
    const { email, password, name } = parsed.data;
    try {
      const { token, user } = await authService.signup(name, email, password);
      res.cookie("token", token, cookieOptions);

      res.status(201).json({
        user,
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log("ERror: ", err);
        return res.status(400).json({
          error: err.message,
        });
      }
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "All fileds are required",
        });
        return;
      }
      const { email, password } = parsed.data;
      const { token, user } = await authService.login(email, password);
      res.cookie("token", token, cookieOptions);
      res.status(200).json({ user });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({
        error: "Internal server error",
      });
    }
  },

  async logout(req: Request, res: Response) {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });
  },
  async me(req: Request, res: Response) {
    try {
      const user = await authService.me(req.user!.id);

      res.status(200).json({ user });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server erreor" });
    }
  },
};
