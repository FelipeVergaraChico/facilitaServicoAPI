import { Request, Response } from 'express'
import jwt, { JwtPayload } from "jsonwebtoken"

// Encript
import bcrypt from "bcrypt"

// Model
import { UserModel } from '../models/User'

// Logger
import Logger from "../../config/logger"

// Middlewares
import createUserToken from "../middleware/create-user-token"
import getToken from '../middleware/get-token'
import getUserByToken from '../middleware/get-user-by-token'

export async function createUsers(req: Request, res: Response): Promise<void> {
    try {
        const { name, email, job, password, cpfcnpj, address, cep, birthday, position } = req.body;

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);


        // Simulate user creation logic
        const user = new UserModel({
            name: name,
            email: email,
            job: job,
            password: passwordHash,
            cpfcnpj: cpfcnpj,
            address: address,
            cep: cep,
            birthday: birthday,
            position: position
        });
        const newUser = await user.save();
        res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
    } catch (error: any) {
        Logger.error(`Error: ${error.message}`);
        res.status(500).json({ message: 'Erro na criação do usuário', error });
    }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        // Verify User using Email
        if (!user) {
            res.status(400).json({ error: "Usuário ou senha incorretos." });
            return;
        }

        // Compare password encripted
        const isMatchPassword = await bcrypt.compare(password, user.password);

        // Verify Password
        if (!isMatchPassword) {
            res.status(400).json({ error: "Usuário ou senha incorretos." });
            return;
        }
        
        await createUserToken(user, req, res)
    }
    catch (error: any) {
        res.status(500).json({ message: 'Erro ao logar', error });
    }
}

// Verify and return self user without password too.
export async function checkuser(req: Request, res: Response): Promise<void> {
    let currentUser = null

    try {
        if (req.headers.authorization) {
            const token = getToken(req)
            if (!token) {
                res.status(401).json({ message: "Token inválido ou não fornecido" })
                return
            }

            const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload

            if (!decoded || !decoded.id) {
                res.status(401).json({ message: "Token inválido" })
                return
            }

            currentUser = await UserModel.findById(decoded.id).select("-password")

            if (!currentUser) {
                res.status(404).json({ message: "Usuário não encontrado" })
                return
            }
        }

        res.status(200).json(currentUser)
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao Verificar usuário', error })
    }
}

export async function editUser(req: Request, res: Response): Promise<void> {
    try {

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (!user) {
            res.status(401).json({ message: "Usuário não autorizado" })
            return
        }

        if(req.file){
            user.image = req.file.filename
        }

        const { name, email, job, password, cpfcnpj, address, cep } = req.body


        // Generate new hash to password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        user.name = name
        user.email = email
        user.job = job
        user.password = passwordHash
        user.cpfcnpj = cpfcnpj
        user.address = address
        user.cep = cep

        // Update Database
        await UserModel.findOneAndUpdate(
            { _id: user._id },
            { $set: user },
            { new: true }
        );

        res.status(200).json({ message: "Usuário atualizado com sucesso" })
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao editar usuário', error })
    }
}

export async function myProfile(req: Request, res: Response): Promise<void> {
    try {
        const token = getToken(req);
        const user = await getUserByToken(token)

        res.status(200).json(user)
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao tentar acessar seu perfil', error });
    }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    try {
        const user = await UserModel.findOne({ _id: id }).select("-password");

        if (!user) {
            res.status(422).json({ message: "Usuário não encontrado" });
            return;
        }

        if (req.headers.authorization) {
            const token = getToken(req)
            const userToken = await getUserByToken(token)
            if (token) {
                const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;
                Logger.info(`Usuário ${(userToken.name)} entrou no perfil de ${user.name}`);
            }
        } else {
            Logger.info(`O Usuário "Anônimo" com IP ${req.ip} acessou o perfil de ${user.name}`);
        }

        res.status(200).json({ user });
    } catch (error: any) {
        Logger.error(`Erro ao buscar o usuário: ${error.message}`);
        res.status(500).json({ message: "Erro ao buscar o usuário", error: error.message });
    }
}