import { Router } from "express";
import { cardsController } from "../controllers/card.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { tagsController } from "../controllers/tag.controller";
const router: Router = Router();

router.use(authMiddleware);

router.get("/:id", cardsController.getCardById);
router.post("/", cardsController.createCard);
router.put("/:id", cardsController.updateCard);
router.delete("/:id", cardsController.deleteCard);

router.post("/:cardId/tags/:tagId", tagsController.assignTag);
router.delete("/:cardId/tags/:tagId", tagsController.removeTag);

export default router;
