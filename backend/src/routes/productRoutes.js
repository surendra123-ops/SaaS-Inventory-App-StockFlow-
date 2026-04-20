import { Router } from "express";
import { productController } from "../controllers/productController.js";
import { validate } from "../middlewares/validate.js";
import { productSchema } from "../validators/productValidator.js";

const router = Router();

router.get("/", productController.list);
router.post("/", validate(productSchema), productController.create);
router.put("/:id", validate(productSchema), productController.update);
router.delete("/:id", productController.remove);

export default router;
