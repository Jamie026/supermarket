import express from "express";
import cors from "cors"; 
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import { sequelize } from "./db/sequelize";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

sequelize.sync().then(() => {
    console.log("Base de datos sincronizada");
    app.listen(PORT, () => console.log("Servidor en http://localhost:" + PORT));
});
