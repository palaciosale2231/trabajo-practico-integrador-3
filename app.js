/*
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import "dotenv/config";
import { startDB } from "./src/config/database.js";
import { userRouter } from "./src/routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 3003;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//rutas
app.use("/api", userRouter);
app.use("/api/events", eventRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
//app.use("/api", taskRouter);
//app.use("/api", roleRouter);

app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor listo en el puerto ${PORT}`);
});*/

import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { startDB } from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";

const app = express();
const PORT = process.env.PORT || 3003;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

//rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/categories", categoryRoutes);

//ruta inexistente
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

//conecta a la base y recién después levanta el servidor
const startServer = async () => {
  try {
    await startDB();
    app.listen(PORT, () => {
      console.log(`Servidor listo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();
