import { body } from "express-validator";
import { CategoryModel } from "../../models/category.model.js";
import { field, unique, idParamValidation } from "./common.validations.js";

const categoryRules = (required) => [
  field(body("name"), required, "El nombre de la categoría es obligatorio")
    .isString()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .custom(unique(CategoryModel, "name", "El nombre de la categoría")),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ max: 200 })
    .withMessage("La descripción puede tener hasta 200 caracteres"),
];

export const createCategoryValidation = categoryRules(true);

export const updateCategoryValidation = [
  ...idParamValidation,
  ...categoryRules(false),
];
