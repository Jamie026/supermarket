import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "privatekey"; 

// Generar un token JWT válido por 1 día
export const generateToken = (data: object): string => {
    return jwt.sign(data, JWT_SECRET, { expiresIn: "1d" });
};

// Verificar un token JWT
export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};