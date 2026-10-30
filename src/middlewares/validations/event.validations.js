import { body } from "express-validator";
import { CategoryModel } from "../../models/category.model.js";

export const createEventValidaiton = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía")
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener almenos 20 caracteres"),

  body(startDate)
    .notEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .isDate()
    .withMessage("La fecha de inicio no es válida"),

  body(endDate)
    .notEmpty()
    .withMessage("La fecha de fin es obligatoria")
    .isDate()
    .withMessage("La fecha de fin no es válida")
    //a diferencia del birthdate este trae el {req} que seria toda la peticion completa http que sirve para buscar otros campos que tambien se mandaron en la peticion
    .custom((value, { req }) => {
      //por eso se puede hacer esto de aca de req.body.startDate asi se puede ver que fecha mando el usuario en el inicio
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error(
          "La fecha de fin debe ser posterior a la fecha de inicio",
        );
      }
      return true;
    }),

  body("capacity")
    .notEmpty()
    .withMessage("La capacidad es obligatoría")
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un número entero mayor o igual a 1"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser mayor o igual a 0"),

  body("status")
    .optional()
    .isIn(["shceduled", "cancelled", "finished"])
    .withMessage(
      "El estado debe ser: scheduled(programado), cancelled(cancelado) o finished(finalizado)",
    ),

  body("location.venue")
    .trim()
    .notEmpty()
    .withMessage("El lugar es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),

  body("location.address")
    .trim()
    .notEmpty()
    .withMessage("La dirección es obligatoria")
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),

  body("location.city")
    .trim()
    .notEmpty()
    .withMessage("La ciudad es obligatoria")
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),

  body("categories")
    .isArray()
    .withMessage("Las categorías deben ser un array"),
];

export const updateEventValidator = [
     body("title")
    .trim()
    .optional()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres"),

  body("description")
    .trim()
    .optional()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener almenos 20 caracteres"),

  body(startDate)
    .optional()
    .isDate()
    .withMessage("La fecha de inicio no es válida"),

  body(endDate)
    .optional()
    .isDate()
    .withMessage("La fecha de fin no es válida")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error(
          "La fecha de fin debe ser posterior a la fecha de inicio",
        );
      }
      return true;
    }),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un número entero mayor o igual a 1"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser mayor o igual a 0"),

  body("status")
    .optional()
    .isIn(["shceduled", "cancelled", "finished"])
    .withMessage(
      "El estado debe ser: scheduled(programado), cancelled(cancelado) o finished(finalizado)",
    ),

  body("location.venue")
    .trim()
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),

  body("location.address")
    .trim()
    .optional()
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),

  body("location.city")
    .trim()
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),

  body("categories")
    .isArray()
    .withMessage("Las categorías deben ser un array"),
];