import { matchedData } from "express-validator";
import { EventModel } from "../models/event.model";

// Campos del organizador que se muestran en las respuestas
const organizerFields = "username email profile";

//post
export const createEvent = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    // Unicidad del título
    const existing = await EventModel.findOne({ title: data.title });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un evento con ese título",
      });
    }

    const event = await EventModel.create({
      ...data,
      organizer: req.user.id, // viene del token, no del body
    });

    return res.status(201).json({
      success: true,
      message: "Evento creado correctamente",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al crear el evento",
      error: error.message,
    });
  }
};

// GET /api/events (autenticado)
export const getEvents = async (req, res) => {
  try {
    const events = await EventModel.find()
      .populate("organizer", organizerFields)
      .populate("categories");

    return res.status(200).json({
      success: true,
      message: "Eventos obtenidos correctamente",
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los eventos",
      error: error.message,
    });
  }
};

// GET /api/events/my (autenticado)
// En el router esta ruta debe ir ANTES de /:id
export const getMyEvents = async (req, res) => {
  try {
    const events = await EventModel.find({ organizer: req.user.id })
      .populate("organizer", organizerFields)
      .populate("categories");

    return res.status(200).json({
      success: true,
      message: "Tus eventos fueron obtenidos correctamente",
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener tus eventos",
      error: error.message,
    });
  }
};

// GET /api/events/:id (autenticado)
export const getEventById = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id)
      .populate("organizer", organizerFields)
      .populate("categories");

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Evento no encontrado" });
    }

    return res.status(200).json({
      success: true,
      message: "Evento obtenido correctamente",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el evento",
      error: error.message,
    });
  }
};

// PUT /api/events/:id (organizador o admin -> lo controla ownerOrAdminMiddleware)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, ...rest } = matchedData(req, { locations: ["body"] });

    // 1. Verificar existencia
    const event = await EventModel.findById(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Evento no encontrado" });
    }

    // 2. Verificar unicidad del título contra OTROS eventos
    if (rest.title) {
      const duplicated = await EventModel.findOne({
        _id: { $ne: id },
        title: rest.title,
      });
      if (duplicated) {
        return res.status(400).json({
          success: false,
          message: "Ya existe un evento con ese título",
        });
      }
    }

    // 3. Armar los cambios (location se actualiza campo por campo)
    const updates = { ...rest };
    if (location) {
      for (const [key, value] of Object.entries(location)) {
        updates[`location.${key}`] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se enviaron campos para actualizar",
      });
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    )
      .populate("organizer", organizerFields)
      .populate("categories");

    return res.status(200).json({
      success: true,
      message: "Evento actualizado correctamente",
      data: updatedEvent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el evento",
      error: error.message,
    });
  }
};

// DELETE /api/events/:id (organizador o admin) - eliminación física
export const deleteEvent = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Evento no encontrado" });
    }

    await EventModel.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json({ success: true, message: "Evento eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el evento",
      error: error.message,
    });
  }
};
