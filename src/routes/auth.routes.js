import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate as handleValidation } from "../middlewares/validate.js";
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
} from "../middlewares/validations/auth.validations.js";

const router = Router();

// Públicas
router.post("/register", registerValidation, handleValidation, register);
router.post("/login", loginValidation, handleValidation, login);

// Usuario autenticado
router.get("/profile", authMiddleware, getProfile);
router.put(
  "/profile",
  authMiddleware,
  updateProfileValidation,
  handleValidation,
  updateProfile,
);
router.post("/logout", authMiddleware, logout);

export default router;
