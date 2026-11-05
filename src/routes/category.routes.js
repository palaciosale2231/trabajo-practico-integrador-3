import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate as handleValidation } from "../middlewares/validate.js";
import { idParamValidation } from "../middlewares/validations/common.validations.js";
import {
  createCategoryValidation,
  updateCategoryValidation,
} from "../middlewares/validations/category.validations.js";

const router = Router();

// Todas requieren usuario autenticado
router.use(authMiddleware);

// Lectura: cualquier usuario autenticado
router.get("/", getCategories);
router.get("/:id", idParamValidation, handleValidation, getCategoryById);

// Escritura: solo admin
router.post(
  "/",
  adminMiddleware,
  createCategoryValidation,
  handleValidation,
  createCategory,
);
router.put(
  "/:id",
  adminMiddleware,
  updateCategoryValidation,
  handleValidation,
  updateCategory,
);
router.delete(
  "/:id",
  adminMiddleware,
  idParamValidation,
  handleValidation,
  deleteCategory,
);

export default router;
