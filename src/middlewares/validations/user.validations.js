import { body } from "express-validator";

export const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El username es obligatorio")
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("El correo no es válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener como mínimo 6 caracteres"),

  body("profile.firstname")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  boy("profile.lastname")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El apellido debe tener entre 3 y 50 caracteres"),

  body("profile.birthDate")
    .optional()
    .isDate()
    .withMessage("La fecha de nacimiento no es válida")
    //Ese value, es el valor que envia el usuario por la petición
    .custom((value) => {
      //osea que new date(value) tiene el valor de la petición del usuario, y el otro como no recibe nada crea automaticamente una nueva fecha con la hora y día del momento
      if (new Date(value) >= new Date()) {
        //el throw hace que se corte todo si falla la validacion, osea que si da true el condicional
        throw new Error("La fecha de nacimiento no es válida");
      }
      //y esto es para avisar que si paso la validacion con exito
      return true;
    }),

  body("profile.phone")
    .optional()
    .isInt()
    .withMessage("El número de télefono es invalido")
    .isLength({ min: 8, max: 15 })
    .withMessage("El número de telefono debe tener entre 8 y 15 dígitos"),
];

export const loginValidator = [
     body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("El correo no es válido"),

    body("password")
    .notEmpty()
    .withMessage("La contraseña no puede estar vácia")
];

export const updateUserValidation = [
    body("username")
    .optional()
    .trim()
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres"),

  body("email")
    .optional()
    .trim()
    .optional()
    .isEmail()
    .withMessage("El correo no es válido"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener como mínimo 6 caracteres"),

  body("profile.firstname")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  boy("profile.lastname")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El apellido debe tener entre 3 y 50 caracteres"),

  body("profile.birthDate")
    .optional()
    .isDate()
    .withMessage("La fecha de nacimiento no es válida")
    .custom((value) => {
      if (new Date(value) >= new Date()) {
        throw new Error("La fecha de nacimiento no es válida");
      }
      return true;
    }),

  body("profile.phone")
    .optional()
    .isInt()
    .withMessage("El número de télefono es invalido")
    .isLength({ min: 8, max: 15 })
    .withMessage("El número de telefono debe tener entre 8 y 15 dígitos"),
];