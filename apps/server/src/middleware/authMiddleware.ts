import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";

interface JWTPayload {
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
  console.log("Cookie token: ", token);

  if (!token) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JWTPayload;

    console.log("decoded: ", decoded);

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
