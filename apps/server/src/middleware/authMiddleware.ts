import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";

export interface JWTPayload {
  id: string;
  name: string;
  email: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      error: "Unauthorized",
      success: false,
      data: null,
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JWTPayload;

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    next(error);
  }
};
