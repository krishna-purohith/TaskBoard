import { NextFunction, Request, Response } from "express";
export class AppError extends Error {
  statusCode;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    console.error("AppError: ", err);
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      data: null,
    });
  }

  if (err.name === "JsonWebTokenError") {
    console.error("Jwt Error: ", err);

    return res.status(401).json({
      success: false,

      error: "Invalid token",
      data: null,
    });
  }

  if (err.name === "TokenExpiredError") {
    console.error("Jwt Error: ", err);

    return res.status(401).json({
      success: false,

      error: "Token expired",
      data: null,
    });
  }

  if (err.name === "PrismaClientKnownRequestError") {
    console.error("Prisma Known Error: ", err);
    return res.status(400).json({
      success: false,

      error: "Database error",
      data: null,
    });
  }
  if (err.name === "PrismaClientUnknownRequestError") {
    console.error("Prisma Unknown Error: ", err);

    return res.status(500).json({
      success: false,

      error: "Unexpected Database error",
      data: null,
    });
  }

  console.error("UnhandledError: ", err);

  res.status(500).json({
    success: false,

    error: "Internal server error",
    data: null,
  });
}
