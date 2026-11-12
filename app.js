import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { startDB } from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";

dotenv.config(); // carga el .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cookieParser()); // para leer req.cookies.token (JWT)
app.use(
  cors({
    // CORS con credentials para que viajen cookies
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json()); // parsea JSON del body

// Mensaje de salud
app.get("/", (req, res) => {
  res.json({ msg: "API funcionando correctamente" });
});

// Rutas
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", categoryRoutes);

// Conexión a Mongo y encendido del server
app.listen(PORT, () => {
  startDB();
  console.log(`Servidor corriendo correctamente en el puerto ${PORT}`);
});
