import { Request, Response } from "express"

// Models
import { messageModel } from "../models/Message"
import { chatModel } from "../models/Chat"
import getToken from "../middleware/get-token"
import getUserByToken from "../middleware/get-user-by-token"

// Middlewares



export async function sendMessage(req: Request, res: Response): Promise<void> {
    try {
        const { chatId } = req.params
        const { message } = req.body

        const userToken = getToken(req)
        const user = await getUserByToken(userToken)



        // Verify if chat exists
        const chat = await chatModel.findById(chatId)
        if (!chat) {
            res.status(404).json({ message: "Chat não encontrado" })
            return
        }

        if (chat.participants[0]._id.toString() !== user._id.toString() && chat.participants[1]._id.toString() !== user._id.toString()) {
            res.status(403).json({ message: "Você não faz parte deste chat." })
            return
        }

        // Create Message
        const newMessage = await messageModel.create({
            chatId,
            senderId: user._id,
            message
        })

        res.status(201).json({ message: "Mensagem enviada com sucesso", data: newMessage })
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao enviar mensagem", error: error.message })
    }
}

export async function listMessages(req: Request, res: Response): Promise<void> {
    try {
        const { chatId } = req.params

        const userToken = getToken(req)
        const user = await getUserByToken(userToken)

        // Verify if chat exists
        const chat = await chatModel.findById(chatId)
        if (!chat) {
            res.status(404).json({ message: "Chat não encontrado" })
            return
        }

        if (chat.participants[0]._id.toString() !== user._id.toString() && chat.participants[1]._id.toString() !== user._id.toString()) {
            res.status(403).json({ message: "Você não faz parte deste chat." })
            return
        }

        // Search messages orders by Date
        const messages = await messageModel.find({ chatId }).sort({ createdAt: 1 })

        res.status(200).json({ messages })
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao buscar mensagens", error: error.message })
    }
}
