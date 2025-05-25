import { Request, Response } from "express"
import jwt from "jsonwebtoken"

// DotEnv
import dotenv from 'dotenv';
dotenv.config();

const createUserToken = async(user: any, req: Request, res: Response) => {
    // create token
    const token = jwt.sign({
        email: user.email,
        id: user._id
    }, `${process.env.JWT_SECRET}`, { expiresIn: "7d" })

    // return token
    return res.status(200).json({
        message: "Voce esta autenticado",
        token: token,
        userId: user._id,
        email: user.email,
        image: user.image
    })
}

export default createUserToken;