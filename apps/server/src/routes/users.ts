import { Router } from "express";
import { userController } from "../controllers/users.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = Router();
router.use(authMiddleware);

router.get("/", userController.getAllUsers);

export default router;
