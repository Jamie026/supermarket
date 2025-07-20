import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

export const sendResetEmail = async (to: string, token: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const templatePath = path.join(__dirname, "templates", "reset-password.html");
        let htmlTemplate = fs.readFileSync(templatePath, "utf8");

        htmlTemplate = htmlTemplate.replace("{{token}}", token);

        const mailOptions = {
            from: '"Soporte" ' + process.env.EMAIL_USER,
            to,
            subject: "Código para restablecer tu contraseña",
            html: htmlTemplate,
        };

        await transporter.sendMail(mailOptions);
        console.log("Correo enviado a:", to);
    } catch (error) {
        console.error("Error enviando el correo:", error);
        throw error;
    }
};
