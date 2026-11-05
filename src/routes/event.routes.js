import { Router } from "express";
import {
  createEvent,
  getEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/owner.middleware.js";
import { validate as handleValidation } from "../middlewares/validate.js";
import { idParamValidation } from "../middlewares/validations/common.validations.js";
import {
  createEventValidation,
  updateEventValidation,
} from "../middlewares/validations/event.validations.js";

const router = Router();

// Todas las rutas de events requieren usuario autenticado
router.use(authMiddleware);

router.post("/", createEventValidation, handleValidation, createEvent);
router.get("/", getEvents);

// IMPORTANTE: /my va ANTES de /:id, si no Express toma "my" como un id
router.get("/my", getMyEvents);

router.get("/:id", idParamValidation, handleValidation, getEventById);

// Primero se valida el id, después el permiso (organizador o admin), después el body
router.put(
  "/:id",
  idParamValidation,
  handleValidation,
  ownerOrAdminMiddleware,
  updateEventValidation,
  handleValidation,
  updateEvent,
);

router.delete(
  "/:id",
  idParamValidation,
  handleValidation,
  ownerOrAdminMiddleware,
  deleteEvent,
);

export default router;
