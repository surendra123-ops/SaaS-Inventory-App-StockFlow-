import { Router } from "express";
import { settingsController } from "../controllers/settingsController.js";
import { validate } from "../middlewares/validate.js";
import { settingsSchema } from "../validators/settingsValidator.js";

const router = Router();

router.get("/", settingsController.get);
router.put("/", validate(settingsSchema), settingsController.update);

export default router;
