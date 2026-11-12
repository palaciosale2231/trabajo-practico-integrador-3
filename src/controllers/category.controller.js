import { CategoryModel } from "../models/category.model.js";
import { eventModel } from "../models/event.model.js";
import { matchedData } from "express-validator";

//GET
export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    return res.status.json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST
export const createCategory = async (req, res) => {
  try {
    const data = matchedData(req);

    const newCategory = await CategoryModel.create(data);

    return res
      .status(201)
      .json({
        message: "Categoría creada correctamente",
        category: newCategory,
      });
  } catch (error) {
    //Si la categoría ya existe, se devuelve un error 400 con un mensaje específico ("se maneja con el codigo 11000")
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe una categoría con ese nombre" });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//PUT
export const updateCategory = async (req, res) => {
  try {
    const data = matchedData(req);

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true },
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res
      .status(200)
      .json({
        message: "Categoría actualizada correctamente",
        category: updatedCategory,
      });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe una categoría con ese nombre" });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//DELETE
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedCategory) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Eliminación en cascada
    await eventModel.updateMany(
      { categories: req.params.id },
      //el pull elimina la categoría de la lista de categorías de los eventos que tienen esta categoría
      { $pull: { categories: req.params.id } },
    );

    return res
      .status(200)
      .json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
