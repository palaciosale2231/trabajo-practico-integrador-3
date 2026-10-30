import { decode } from "jsonwebtoken";
import { verifyToken } from "../helpers/jtw.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No se proporcionó un token" });
    }
    const decoded = verifyToken(token);
    req.user = decoded; //esto seria algo como {id,role}
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};