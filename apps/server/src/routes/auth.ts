import express, { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);
router.get("/logout", authController.logout);

export default router;
