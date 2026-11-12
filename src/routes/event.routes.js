import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerMiddleware } from "../middlewares/owner.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import {
  createEventValidator,
  updateEventValidator,
} from "../middlewares/validations/event.validation.js";

const router = Router();

router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.post(
  "/events",
  authMiddleware,
  createEventValidator,
  validator,
  createEvent,
);
router.put(
  "/events/:id",
  authMiddleware,
  ownerMiddleware,
  updateEventValidator,
  validator,
  updateEvent,
);
router.delete("/events/:id", authMiddleware, ownerMiddleware, deleteEvent);

export default router;
