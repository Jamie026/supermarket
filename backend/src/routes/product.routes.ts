import { Router, Request, Response } from "express";
import { Product } from "../models/Product";
import { authMiddleware, AuthRequest } from "../middlewares/auth";

const products = Router();

// Obtener todos los productos (requiere estar autenticado)
products.get("/", authMiddleware, async (req: Request, res: Response) => {
    const items = await Product.findAll();
    res.json(items);
});

// Crear un nuevo producto (requiere autenticación)
products.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { name, stock, price } = req.body;

    try {
        const item = await Product.create({
            name,
            stock,
            price,
            user_id: req.user.id, // Asociar producto al usuario autenticado
        });
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: "Error creando producto", error: err });
    }
});

// Obtener un producto por ID (requiere autenticación)
products.get("/:id", authMiddleware, async (req: Request, res: Response) => {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(item);
});

// Actualizar un producto existente por ID (requiere autenticación)
products.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Producto no encontrado" });

    try {
        await item.update(req.body);
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: "Error actualizando producto", error: err });
    }
});

// Eliminar un producto por ID (requiere autenticación)
products.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Producto no encontrado" });

    try {
        await item.destroy();
        res.json({ message: "Producto eliminado" });
    } catch (err) {
        res.status(500).json({ message: "Error eliminando producto", error: err });
    }
});

export default products;
