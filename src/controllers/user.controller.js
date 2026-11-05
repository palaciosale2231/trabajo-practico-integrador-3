import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { EventModel } from "../models/event.model.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

// GET /api/users (solo admin)
export const getUsers = async (req, res) => {
  try {
    // deletedAt: null -> ignora a los eliminados lógicamente
    const users = await UserModel.find({ deletedAt: null })
      .select("-password")
      .populate("events"); // virtual populate

    return res.status(200).json({
      success: true,
      message: "Usuarios obtenidos correctamente",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      error: error.message,
    });
  }
};

// GET /api/users/:id (solo admin)
export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
      .select("-password")
      .populate("events");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      success: true,
      message: "Usuario obtenido correctamente",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el usuario",
      error: error.message,
    });
  }
};

// PUT /api/users/:id (solo admin)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, profile, ...rest } = matchedData(req, {
      locations: ["body"],
    });

    // 1. Verificar que exista (y esté activo)
    const user = await UserModel.findOne({ _id: id, deletedAt: null });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // 2. Verificar unicidad contra OTROS usuarios
    const conditions = [];
    if (rest.username) conditions.push({ username: rest.username });
    if (rest.email) conditions.push({ email: rest.email });

    if (conditions.length > 0) {
      const duplicated = await UserModel.findOne({
        _id: { $ne: id },
        $or: conditions,
      });
      if (duplicated) {
        return res.status(400).json({
          success: false,
          message: "El username o el email ya están en uso",
        });
      }
    }

    // 3. Armar los cambios
    const updates = { ...rest };
    if (password) updates.password = await hashPassword(password);
    if (profile) {
      for (const [key, value] of Object.entries(profile)) {
        updates[`profile.${key}`] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se enviaron campos para actualizar",
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

// DELETE /api/users/:id (solo admin) - eliminación lógica + cascada de eventos
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findOne({ _id: id, deletedAt: null });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Eliminación lógica: no se borra, se marca la fecha
    await UserModel.updateOne({ _id: id }, { $set: { deletedAt: new Date() } });

    // Cascada: se eliminan los eventos que organizaba
    const { deletedCount } = await EventModel.deleteMany({ organizer: id });

    return res.status(200).json({
      success: true,
      message: `Usuario eliminado correctamente junto con ${deletedCount} evento(s)`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el usuario",
      error: error.message,
    });
  }
};
