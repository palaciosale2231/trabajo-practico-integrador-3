import { UserModel } from "../models/user.model.js";
import { eventModel } from "../models/event.model.js";
import { hashPassword } from "../helpers/bcrypt.js";
import { matchedData } from "express-validator";

//GET
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ deletedAt: null })
      .select("-password")
      //este populate es virtual y trae los eventos de los usuarios
      .populate("events");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ mesagge: "Error interno del servidor" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
      .select("-password")
      .populate("events");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//PUT
export const updateUser = async (req, res) => {
  try {
    const data = matchedData(req);
    const { password, profile, ...topLevelFields } = data;
    if (password) {
      topLevelFields.password = await hashPassword(password);
    }

    // Construimos las claves con notación de punto para no reemplazar el perfil completo
    const updateFields = { ...topLevelFields };
    if (profile) {
      for (const [key, value] of Object.entries(profile)) {
        updateFields[`profile.${key}`] = value;
      }
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: updateFields },
      { new: true, runValidators: true },
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({
      message: "Usuario actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "El email o username ya está en uso" });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await eventModel.deleteMany({ organizer: req.params.id });

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
