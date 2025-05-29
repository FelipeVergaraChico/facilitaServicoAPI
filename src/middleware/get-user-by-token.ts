// DotEnv
import dotenv from 'dotenv';
dotenv.config();

// Model
import { UserModel } from "../models/User"

// Token
import jwt from "jsonwebtoken"

// Get user by JWT token
const getUserByToken = async (token: string | null) => {
    if (!token) {
        throw new Error("Acesso negado!")
    }

    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
            throw new Error("Token inválido!");
        }

        const userId = decoded.id;

        const user = await UserModel.findOne({ _id: userId }).select("-password");

        if (!user) {
            throw new Error("Usuário não encontrado!");
        }

        return user;
    } catch (err: any) {
        throw new Error("Erro ao verificar o token: " + err.message);
    }
};

export default getUserByToken;