import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "privatekey"; 

export const generateToken = (data: object): string => {
    return jwt.sign(data, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};