import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "privatekey";

// Extiende la interfaz Request para incluir al usuario autenticado
export interface AuthRequest extends Request {
    user?: any;
}

// Middleware de autenticación con JWT
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    // Obtener el token del encabezado Authorization
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
        // Verificar y decodificar token
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Adjuntar datos del usuario al request
        next(); // Continuar con la siguiente función
    } catch (err) {
        console.log("Invalid token");
        return res.status(401).json({ message: "Invalid token" });
    }
}
