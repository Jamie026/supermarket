import { Router, Request, Response } from "express";
import { Product } from "../models/Product";
import { authMiddleware, AuthRequest } from "../middlewares/auth";

const products = Router();

products.get("/", authMiddleware, async (req: Request, res: Response) => {
    const items = await Product.findAll();
    res.json(items);
});

products.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { name, stock, price } = req.body;

    try {
        const item = await Product.create({
            name,
            stock,
            price,
            user_id: req.user.id,
        });
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: "Error creating product", error: err });
    }
});

products.get("/:id", authMiddleware, async (req: Request, res: Response) => {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json(item);
});

products.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Product not found" });

    try {
        await item.update(req.body);
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: "Error updating product", error: err });
    }
});

products.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Product not found" });

    try {
        await item.destroy();
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting product", error: err });
    }
});

export default products;
