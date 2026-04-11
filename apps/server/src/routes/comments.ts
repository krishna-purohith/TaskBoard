import { Router } from "express";
import { commentsController } from "../controllers/comment.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = Router({ mergeParams: true });

router.use(authMiddleware);

router.post("/", commentsController.addComment);
router.delete("/:commentId", commentsController.deleteComment);

export default router;
