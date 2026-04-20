import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, signupSchema } from "../validators/authValidator.js";

const router = Router();

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;
