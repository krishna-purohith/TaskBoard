import { Router } from "express";
import { columnController } from "../controllers/column.controller";
import { authMiddleware } from "../middleware/authMiddleware";
const router: Router = Router();
router.use(authMiddleware);

router.post("/", columnController.createColumn);
router.put("/:id", columnController.updateColumn);
router.delete("/:id", columnController.deleteColumn);

export default router;
