import { Request, Response } from 'express';

// Encript
import bcrypt from "bcrypt";

// Model
import { UserModel } from '../models/User'; // Assuming you have a User model defined

// Logger
import Logger from "../../config/logger";

// Middlewares
import createUserToken from "../middleware/create-user-token";

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
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error: any) {
        Logger.error(`Error: ${error.message}`);
        res.status(500).json({ message: 'Error creating user', error });
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
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
    try {
        const users = await UserModel.find();
        res.status(200).json({ message: 'Users fetched successfully', users });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}

export async function checkuser(req: Request, res: Response): Promise<void> {
    try {
        const { email } = req.body;
        // Simulate user check logic
        if (email === '') {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User exists' });
    } catch (error) {
        res.status(500).json({ message: 'Error checking user', error });
    }
}

export async function editUser(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { name, email, password, cpfcnpj, address, cep, birthday, position } = req.body;
        // Simulate user update logic
        const updatedUser = { id, name, email, password, cpfcnpj, address, cep, birthday, position };
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        // Simulate fetching user by ID logic
        const user = { id, name: 'John Doe', email: '', password: '', cpfcnpj: '', address: '', cep: '', birthday: '', position: '' };
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User fetched successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
}

export async function myProfile(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        // Simulate fetching user profile logic
        const userProfile = { id, name: 'John Doe', email: '', password: '', cpfcnpj: '', address: '', cep: '', birthday: '', position: '' };
        if (!userProfile) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User profile fetched successfully', userProfile });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error });
    }
}