import { Router, Request, Response } from "express";
import { User } from "../models/User";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

const users = Router();

users.post("/register", async (req: Request, res: Response) => {
    console.log(req.body);
    
    const { name, lastname, username, password, email, birthday } = req.body;

    try {
        const existing = await User.findOne({ where: { username } });
        if (existing) return res.status(400).json({ message: "Username already exists" });

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
        res.status(500).json({ message: "Error creating user", error: err });
    }
});

users.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const userData = user.toJSON();

        const token = generateToken({ id: user.id, username: user.username });

        res.json({
            message: "Login successful",
            token,
            user: userData
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Login error", error: err });
    }
});

export default users;