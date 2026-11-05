import { matchedData } from "express-validator";
import { CategoryModel } from "../models/category.model.js";
import { EventModel } from "../models/event.model.js";

// POST /api/categories (solo admin)
export const createCategory = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    // Unicidad del nombre
    const existing = await CategoryModel.findOne({ name: data.name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una categoría con ese nombre",
      });
    }

    const category = await CategoryModel.create(data);

    return res.status(201).json({
      success: true,
      message: "Categoría creada correctamente",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al crear la categoría",
      error: error.message,
    });
  }
};

// GET /api/categories (autenticado)
export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    return res.status(200).json({
      success: true,
      message: "Categorías obtenidas correctamente",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
      error: error.message,
    });
  }
};

// GET /api/categories/:id (autenticado) - con virtual populate events
export const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id).populate(
      "events",
    );

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Categoría no encontrada" });
    }

    return res.status(200).json({
      success: true,
      message: "Categoría obtenida correctamente",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener la categoría",
      error: error.message,
    });
  }
};

// PUT /api/categories/:id (solo admin)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = matchedData(req, { locations: ["body"] });

    // 1. Verificar existencia
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Categoría no encontrada" });
    }

    // 2. Verificar unicidad del nombre contra OTRAS categorías
    if (data.name) {
      const duplicated = await CategoryModel.findOne({
        _id: { $ne: id },
        name: data.name,
      });
      if (duplicated) {
        return res.status(400).json({
          success: false,
          message: "Ya existe una categoría con ese nombre",
        });
      }
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Categoría actualizada correctamente",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la categoría",
      error: error.message,
    });
  }
};

// DELETE /api/categories/:id (solo admin) - cascada: se quita de los eventos
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Categoría no encontrada" });
    }

    // $pull saca el id de categoría del array categories de todos los eventos que la tengan
    await EventModel.updateMany(
      { categories: id },
      { $pull: { categories: id } },
    );

    await CategoryModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Categoría eliminada y removida de los eventos correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la categoría",
      error: error.message,
    });
  }
};
