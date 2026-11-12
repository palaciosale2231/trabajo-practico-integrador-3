import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import { updateUserValidator } from "../middlewares/validations/user.validation.js";

const router = Router();

// todas las rutas son solo admin
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, adminMiddleware, getUserById);
router.put(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  updateUserValidator,
  validator,
  updateUser,
);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;

//git checkout -b nombre-de-la-rama

//git push -u origin nombre-de-la-rama
