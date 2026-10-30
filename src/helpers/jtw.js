import jwt from "jsonwebtoken";
import "dotenv/config";
//el payload es la información que se va a guardar en el token, en este caso son los datos del usuario
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h", // configurable por .env
  });
};
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};