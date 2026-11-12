import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
} from "../middlewares/validations/category.validation.js";

const router = Router();

router.get("/categories", getAllCategories);
router.post(
  "/categories",
  authMiddleware,
  adminMiddleware,
  createCategoryValidator,
  validator,
  createCategory,
);
router.put(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  updateCategoryValidator,
  validator,
  updateCategory,
);
router.delete(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategory,
);

export default router;
