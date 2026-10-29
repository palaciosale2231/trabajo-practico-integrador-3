import { UserModel } from "../models/User.model.js";
import { EventModel } from "../models/event.model.js";
//import bcrypt from "bcryptjs";

// POST /api/users → Crear un nuevo usuario (solo admin)
export const createUser = async (req, res) => {
  try {
    const { username, email, password, role, profile } = req.body;

    // 1. Validar que no exista el username o email
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El username o email ya está en uso",
      });
    }

    // 2. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Crear el usuario con el perfil embebido
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      profile: {
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        birthDate: profile?.birthDate || null,
        phone: profile?.phone || null,
      },
    });

    // Ocultamos la contraseña en la respuesta
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: userResponse,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/users → Listar usuarios activos con virtual populate de events (solo admin)
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ deletedAt: null }).populate("events");
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/:id → Obtener un usuario activo con sus eventos (solo admin)
export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      _id: req.params.id,
      deletedAt: null,
    }).populate("events");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario activo no encontrado" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/:id → Actualizar un usuario (solo admin)
export const updateUser = async (req, res) => {
  try {
    // Si viene la clave password, se encripta o borra para evitar guardar en texto plano
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado o inactivo" });
    }

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/:id → Eliminación lógica con eliminación en cascada de sus eventos (solo admin)
export const deleteUser = async (req, res) => {
  try {
    // 1. Borrado lógico (deletedAt)
    const user = await UserModel.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado o ya fue eliminado",
      });
    }

    // 2. Eliminación física en cascada de sus eventos
    await EventModel.deleteMany({ organizer: req.params.id });

    return res.status(200).json({
      success: true,
      message:
        "Usuario desactivado lógicamente y sus eventos asociados han sido eliminados",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
