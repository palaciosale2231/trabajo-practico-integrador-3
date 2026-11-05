import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate as handleValidation } from "../middlewares/validate.js";
import { idParamValidation } from "../middlewares/validations/common.validations.js";
import { updateUserValidation } from "../middlewares/validations/user.validations.js";

const router = Router();

// Todas las rutas de users son solo admin
router.use(authMiddleware, adminMiddleware);

router.get("/", getUsers);
router.get("/:id", idParamValidation, handleValidation, getUserById);
router.put("/:id", updateUserValidation, handleValidation, updateUser);
router.delete("/:id", idParamValidation, handleValidation, deleteUser);

export default router;
