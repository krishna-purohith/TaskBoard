import { prisma } from "@repo/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { AppError } from "../middleware/errorMiddleware";

export const authService = {
  async signup(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("first");
      throw new AppError("User already exists.", 400);
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashed },
    });
    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn,
      }
    );
    return {
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token,
    };
  },
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("User doesnot exist. ", 400);
    }
    const verified = await bcrypt.compare(password, user.password);
    if (!verified) {
      throw new AppError("Invalid credentials", 400);
    }
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  },
  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) {
      throw new AppError("User not found", 400);
    }
    return user;
  },
};
