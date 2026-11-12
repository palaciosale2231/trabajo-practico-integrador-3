import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} from "../middlewares/validations/user.validation.js";

const router = Router();

router.post("/auth/register", registerValidator, validator, register);
router.post("/auth/login", loginValidator, validator, login);
router.get("/auth/profile", authMiddleware, getProfile);
router.put(
  "/auth/profile",
  authMiddleware,
  updateProfileValidator,
  validator,
  updateProfile,
);
router.post("/auth/logout", authMiddleware, logout);

export default router;
