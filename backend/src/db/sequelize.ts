import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Instancia de Sequelize usando variables de entorno
export const sequelize = new Sequelize(
    process.env.DB_NAME as string,      // Nombre de la base de datos
    process.env.DB_USER as string,      // Usuario
    process.env.DB_PASS,                // Contraseña
    {
        host: process.env.DB_HOST,                     // Host 
        dialect: process.env.DB_DIALECT as any,        // Dialecto 
        logging: false                                 // Desactiva logs de SQL en consola
    }
);
