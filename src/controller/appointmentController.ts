import { Request, Response } from 'express'

// Model
import { appointmentModel } from '../models/Appointment'
import { chatModel } from "../models/Chat"

// Logger
import Logger from "../../config/logger"

// Middlewares
import getToken from '../middleware/get-token'
import getUserByToken from '../middleware/get-user-by-token'


export async function createAppointment(req: Request, res: Response): Promise<void> {
    try {
        const { selfEmployed, day, address } = req.body

        const token = getToken(req)
        const client = await getUserByToken(token)

        if (!client) {
            res.status(401).json({ message: "Acesso não autorizado." })
            return
        }

        if (client._id.toString() === selfEmployed._id) {
            res.status(400).json({ message: "Você não pode agendar com você mesmo." })
            return
        }

        if (client.position !== "Client") {
            res.status(403).json({ message: "Apenas clientes podem agendar serviços" })
            return
        }

        const appointment = await appointmentModel.create({
            client: {
                _id: client._id,
                name: client.name,
                email: client.email
            },
            selfEmployed,
            day,
            address,
            status: "pending",
            acceptedBySelfEmployed: null
        })

        await chatModel.create({
            participants: [client._id, selfEmployed._id],
            appointmentId: appointment._id
        })

        res.status(201).json({ message: "Agendamento criado com sucesso.", appointment })

    } catch (error: any) {
        Logger.error(`Erro ao criar agendamento: ${error.message}`)
        res.status(500).json({ message: "Erro ao criar agendamento." })
    }
}

export async function getAppointmentById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params
        const appointment = await appointmentModel.findById(id)

        if (!appointment) {
            res.status(404).json({ message: "Agendamento não encontrado" })
            return
        }

        res.status(200).json({ appointment })
    } catch (error: any) {
        Logger.error(`Erro ao buscar agendamento: ${error.message}`)
        res.status(500).json({ message: "Erro ao buscar agendamento", error: error.message })
    }
}

export async function getAppointmentsByUserId(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params

        const appointments = await appointmentModel.find({
            $or: [
                { 'client._id': id },
                { 'selfEmployed._id': id }
            ]
        })

        res.status(200).json(appointments)
    } catch (error) {
        Logger.error(`Falha ao obter agendamentos para o usuário ${req.params.id}: ${error}`)
        res.status(500).json({ message: 'Erro do Servidor Interno' })
    }
}

export async function acceptAppointment(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params

        const token = getToken(req)
        const user = await getUserByToken(token)

        const appointment = await appointmentModel.findById(id)

        if (!appointment) {
            res.status(404).json({ message: "Agendamento não encontrado" })
            return
        }

        if (!appointment.selfEmployed || appointment.selfEmployed._id.toString() !== user._id.toString()) {
            res.status(403).json({ message: "Você não está autorizado a aceitar este Agendamento" })
            return
        }

        appointment.acceptedBySelfEmployed = true
        appointment.status = "pending"

        await appointment.save()

        Logger.info(`Agendamento ${id} aceito por autônomo ${user.email}`)

        res.status(200).json({ message: "Agendamento aceito com sucesso", appointment })

    } catch (error: any) {
        Logger.error(`Erro ao aceitar agendamento: ${error.message}`)
        res.status(500).json({ message: "Erro do Servidor Interno" })
    }
}

export async function rejectAppointment(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params
        const token = getToken(req)
        const user = await getUserByToken(token)

        const appointment = await appointmentModel.findById(id)
        if (!appointment) {
            res.status(404).json({ message: "Agendamento não encontrado" })
            return
        }

        if (!appointment.selfEmployed || appointment.selfEmployed._id.toString() !== user._id.toString()) {
            res.status(403).json({ message: "Você não está autorizado a rejeitar este Agendamento" })
            return
        }

        appointment.acceptedBySelfEmployed = false
        appointment.status = "rejected"
        await appointment.save()

        res.status(200).json({ message: "Agendamento rejeitado com sucesso" })
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao rejeitar Agendamento", error: error.message })
    }
}

export async function finishAppointment(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params
        const token = getToken(req)
        const user = await getUserByToken(token)

        const appointment = await appointmentModel.findById(id)
        if (!appointment) {
            res.status(404).json({ message: "Agendamento não encontrado" })
            return
        }

        if (!appointment.selfEmployed || appointment.selfEmployed._id.toString() !== user._id.toString()) {
            res.status(403).json({ message: "Você não está autorizado a terminar esse Agendamento" })
            return
        }

        appointment.status = "finished"
        await appointment.save()

        res.status(200).json({ message: "Agendamento marcado como terminado" })
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao finalizar Agendamento", error: error.message })
    }
}

export async function cancelAppointment(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const token = getToken(req);
        const user = await getUserByToken(token);

        const appointment = await appointmentModel.findById(id);
        if (!appointment) {
            res.status(404).json({ message: "Agendamento não encontrado" });
            return;
        }

        // Verifica se quem está cancelando é o cliente dono do agendamento
        if (!appointment.client || appointment.client._id.toString() !== user._id.toString()) {
            res.status(401).json({ message: "Não autorizado: apenas o cliente pode cancelar este agendamento" });
            return;
        }

        await appointment.deleteOne();

        Logger.info(`Agendamento ${id} cancelado pelo cliente ${user.name}`);

        res.status(200).json({ message: "Agendamento cancelado com sucesso" });
    } catch (error: any) {
        Logger.error(`Erro ao cancelar agendamento: ${error.message}`);
        res.status(500).json({ message: "Erro ao cancelar agendamento", error: error.message });
    }
}
