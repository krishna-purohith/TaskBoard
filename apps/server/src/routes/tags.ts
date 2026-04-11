import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { tagsController } from "../controllers/tag.controller";

const router: Router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get("/", tagsController.getAllTags);
router.post("/", tagsController.createTag);
router.post("/:cardId/tags/:tagId", tagsController.assignTag);
router.delete("/:cardId/tags/:tagId", tagsController.removeTag);

export default router;
