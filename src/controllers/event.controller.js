import { eventModel } from "../models/event.model.js";
import { matchedData } from "express-validator";

//GET
export const getAllEvents = async (req, res) => {
  try {
    const events = await eventModel
      .find()
      .populate("organizador", "-password") //RELACION 1 A 1
      .populate("categories"); //RELACION MUCHOS A MUCHOS

    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await eventModel
      .findOne(req.params.id)
      .populate("organizer", "-password")
      .populate("categories");

    if (!event) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const createEvent = async (req, res) => {
  try {
    const data = matchedData(req);

    const newEvent = await eventModel.create({
      ...data,
      organizer: req.user.id, //esto viene del token, no del body
    });

    return res
      .status(201)
      .json({ message: "Evento creado correctamente", event: newEvent });
  } catch (error) {
    // 1. Si el error es por duplicado(11000), avisamos al usuario (Error 400)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe un evento con ese título" });
    }
    // 2. Si es cualquier otro error, avisamos que falló el servidor (Error 500)
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//PUT
export const updateEvent = async (req, res) => {
  try {
    const data = matchedData(req);

    const updatedEvent = await eventModel.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidator: true },
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    return res
      .status(200)
      .json({ message: "Evento actualizado correctamente" });
  } catch (error) {
    if (error === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe un evento con ese título" });
    }

    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//DELETE

export const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await eventModel.findByIdAndUpdate(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    return res.status(200).json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
