import express from "express";
import cors from "cors"; 
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import { sequelize } from "./db/sequelize";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

// Configurar CORS para permitir peticiones desde el frontend
app.use(cors({
    origin: "http://localhost:5173", // URL del frontend 
    credentials: true
}));

// Habilitar lectura de JSON en las solicitudes
app.use(express.json());

// Rutas principales de la API
app.use("/api/users", userRoutes);     // Rutas de usuarios
app.use("/api/products", productRoutes); // Rutas de productos

// Sincronizar base de datos y arrancar servidor
sequelize.sync().then(() => {
    console.log("Base de datos sincronizada");
    app.listen(PORT, () => console.log("Servidor en http://localhost:" + PORT));
});
