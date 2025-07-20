import express from "express";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes"
import { sequelize } from "./db/sequelize";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/productos", productRoutes);

sequelize.sync().then(() => {
    console.log("Base de datos sincronizada");
    app.listen(PORT, () => console.log("Servidor en http://localhost:" + PORT));
});