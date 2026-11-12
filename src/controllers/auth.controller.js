import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import { matchedData } from "express-validator";
import { generateToken } from "../helpers/jtw.js";
import { UserModel } from "../models/user.model.js";

//Registro del usuario(creado)
export const register = async (req, res) => {
  try {
    const data = matchedData(req);
    const { username, email, password, profile } = data;

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El email o username ya estan registrados." });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      profile,
    });

    return res
      .status(201)
      .json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
//Login del usuario
export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req);
    //Esto es para buscar si el usuario esta activo(osea que no esta eliminado lógicamente)
    const user = await UserModel.findOne({ email, deletedAt: null });

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
//GET
export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.user.id, deletedAt: null });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(user).select("-password");
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//PUT

export const updateProfile = async (req, res) => {
  try {
    const data = matchedData(req);

    //Acá lo que hacemos es crear las claves con el punto para no reemplazar todo el perfil completo, asi solo se reemplazan las cosas que queremos cambiar, como por ejemplo solo cambiar el firstname y no el lastname. Lo que hace el codigo es crear una constante donde se van a guardar las celdas actualizadas y con el condicional decimos que si viene información para el perfil desde la data validada, vamos a hacer un for que separa en clave-valor cada objeto que entra. Entonces, vamos a guardar en updateFields las propiedades de profile que el usuario quiere actualizar, y a todo ese valor lo vamos a llamar value. Así tiene el formato exacto que Mongo necesita ('profile.firstname') para actualizar solamente ese campo específico sin borrar todo lo demás que ya estaba guardado.
    const updateFields = {};
    if (data.profile) {
      for (const [key, value] of Object.entries(data.profile)) {
        updateFields[`profile.${key}`] = value;
      }
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.user.id, deletedAt: null },
      { $set: updateFields },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res
      .status(200)
      .json({ message: "Perfil actualizado correctamente", data: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Sesión cerrada con éxito" });
};
