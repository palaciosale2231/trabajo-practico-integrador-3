import { eventModel } from "../models/event.model.js";

export const ownerMiddleware = async (req, res, next) => {
  try {
    const event = await eventModel.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    if (req.user.role === "admin") {
      return next();
    }

    // comparar organizador (ObjectId) con el id del token
    if (event.organizer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tenés permisos para realizar esta acción" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};