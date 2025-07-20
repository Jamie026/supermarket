import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Encriptar contraseña usando bcrypt
export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

// Comparar una contraseña ingresada con su hash
export const comparePassword = async (input: string, hash: string) => {
    return await bcrypt.compare(input, hash);
};