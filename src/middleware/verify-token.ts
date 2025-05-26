import jwt from "jsonwebtoken"
import getToken from "./get-token"
import { Request, Response, NextFunction } from "express"
import Logger from "../../config/logger"
import dotenv from 'dotenv';

dotenv.config();

// midleware to validate token
const checkToken = (req: any, res: Response, next: NextFunction) => {

    if(!req.headers.authorization){
        res.status(401).json({ message: "Acesso negado!" })
        return
    }

    const token = getToken(req)

    if(!token){
        res.status(401).json({ message: "Acesso negado!" })
        return
    }

    try {

        const verified = jwt.verify(token, `${process.env.JWT_SECRET}`)
        req.user = verified;
        next()

    } catch(err: any){
        Logger.error(`Erro ao verificar token: ${err.message}. Requisição de: ${req.ip}`);
        res.status(400).json({ message: "Token invalido" })
    }

}

export default checkToken