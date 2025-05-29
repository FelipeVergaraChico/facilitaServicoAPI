import { Request } from "express";

const getToken = (req: Request): string | null => {
    const authHeader = req.headers.authorization;

    // Verifica se o cabeçalho Authorization existe e está no formato correto
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];
    return token;
};

export default getToken;