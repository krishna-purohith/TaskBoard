import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { tagsController } from "../controllers/tag.controller";

const router: Router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get("/", tagsController.getAllTags);
router.post("/", tagsController.createTag);

export default router;
