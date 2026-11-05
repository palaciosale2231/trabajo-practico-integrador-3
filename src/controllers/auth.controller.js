import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { generateToken } from "../helpers/jtw.js";
import { hashPassword, comparePassword } from "../helpers/bcript.js";

// Opciones de la cookie: httpOnly evita que JavaScript del navegador la lea
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 día
};

// POST /api/auth/register (público)
export const register = async (req, res) => {
  try {
    const { username, email, password, profile } = matchedData(req, {
      locations: ["body"],
    });

    // Unicidad: se busca también entre eliminados lógicos, porque el índice único de Mongo los sigue considerando
    const existing = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "El username o el email ya están registrados",
      });
    }

    // El role NO se toma del body: todo registro público es 'user'
    const user = await UserModel.create({
      username,
      email,
      password: await hashPassword(password),
      profile,
    });

    const { password: _password, ...userData } = user.toObject();

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al registrar el usuario",
      error: error.message,
    });
  }
};

// POST /api/auth/login (público)
export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req, { locations: ["body"] });

    // Solo usuarios activos; +password por si en el esquema está con select: false
    const user = await UserModel.findOne({ email, deletedAt: null }).select(
      "+password",
    );
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales inválidas" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales inválidas" });
    }

    const token = generateToken({ id: user._id, role: user.role });
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login exitoso",
      data: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

// GET /api/auth/profile (autenticado)
export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      _id: req.user.id,
      deletedAt: null,
    }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      success: true,
      message: "Perfil obtenido correctamente",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el perfil",
      error: error.message,
    });
  }
};

// PUT /api/auth/profile (autenticado) - actualiza solo el documento embebido profile
export const updateProfile = async (req, res) => {
  try {
    const { profile } = matchedData(req, { locations: ["body"] });

    if (!profile || Object.keys(profile).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe enviar al menos un campo del perfil",
      });
    }

    // { firstName: "Ana" } -> { "profile.firstName": "Ana" } para no pisar el resto del perfil
    const updates = {};
    for (const [key, value] of Object.entries(profile)) {
      updates[`profile.${key}`] = value;
    }

    const user = await UserModel.findOneAndUpdate(
      { _id: req.user.id, deletedAt: null },
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el perfil",
      error: error.message,
    });
  }
};

// POST /api/auth/logout (autenticado)
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
    });

    return res
      .status(200)
      .json({ success: true, message: "Sesión cerrada correctamente" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al cerrar sesión",
      error: error.message,
    });
  }
};
