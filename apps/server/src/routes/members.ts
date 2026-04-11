import { Router } from "express";
import { memberController } from "../controllers/member.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = Router({ mergeParams: true });

router.use(authMiddleware);

router.post("/", memberController.addMember);
router.delete("/:userId", memberController.removeMember);

export default router;
