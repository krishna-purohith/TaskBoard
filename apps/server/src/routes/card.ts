import { Router } from "express";
import { cardsController } from "../controllers/card.controller";
import { authMiddleware } from "../middleware/authMiddleware";
const router: Router = Router();

router.use(authMiddleware);

router.get("/:id", cardsController.getCardById);
router.post("/", cardsController.createCard);
router.put("/:id", cardsController.updateCard);
router.delete("/:id", cardsController.deleteCard);

export default router;
