import { Router, Request, Response } from "express";
import { User } from "../models/User";
import { ResetPassword } from "../models/ResetPassword";
import { v4 as uuidv4 } from "uuid";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { sendResetEmail } from "../utils/mail";

const users = Router();

users.post("/register", async (req: Request, res: Response) => {
    console.log(req.body);
    
    const { name, lastname, username, password, email, birthday } = req.body;

    try {
        const existing = await User.findOne({ where: { email} });
        if (existing) return res.status(400).json({ message: "Email ya registrado" });

        const hashed = await hashPassword(password);
        const newUser = await User.create({
            name,
            lastname,
            username,
            password: hashed,
            email,
            birthday,
        });

        const userResponse = newUser.toJSON();

        res.status(201).json(userResponse);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error creando usuario", error: err });
    }
});

users.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(401).json({ message: "Credenciales incorrectas" });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Credenciales incorrectas" });

        const userData = user.toJSON();

        const token = generateToken({ id: user.id, username: user.username });

        res.json({
            message: "Login correcto",
            token,
            user: userData
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Login error", error: err });
    }
});

users.post("/forgot-password", async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email requerido" });

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: "Usuario no encontrado con ese email" });

        const token = uuidv4();

        const resetEntry = await ResetPassword.create({
            user_id: user.id,
            token
        });

        try {
            await sendResetEmail(user.email, token);
            res.json({ message: "Código de recuperación enviado al correo" });
        } catch (emailError) {
            await resetEntry.destroy();
            console.error("Error al enviar el correo:", emailError);
            res.status(500).json({ message: "Error al enviar el correo de recuperación" });
        }
    } catch (err) {
        console.error("Error general:", err);
        res.status(500).json({ message: "Error al generar código de recuperación", error: err });
    }
});

users.post("/verify-reset-code", async (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code) return res.status(400).json({ success: false, message: "Código requerido" });

    try {
        const tokenEntry = await ResetPassword.findOne({ where: { token: code } });

        if (!tokenEntry) return res.status(404).json({ success: false, message: "Código inválido" });

        await tokenEntry.destroy();

        res.json({ success: true, userId: tokenEntry.user_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error al verificar código" });
    }
});

users.post("/reset-password", async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: "Email y nueva contraseña requeridos" });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const hashedPassword = await hashPassword(newPassword)
        user.password = hashedPassword;
        await user.save();

        return res.json({ success: true, message: "Contraseña actualizada exitosamente" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al actualizar la contraseña" });
    }
});

export default users;