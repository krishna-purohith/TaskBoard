import { Router } from "express";
import { boardController } from "../controllers/board.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = Router();
router.use(authMiddleware);

router.get("/", boardController.getAllBoards);
router.get("/:id", boardController.getBoardById);
router.post("/", boardController.createBoard);
router.put("/:id", boardController.updateBoard);
router.delete("/:id", boardController.deleteBoard);

export default router;
