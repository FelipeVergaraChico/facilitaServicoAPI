import { Request, Response } from 'express'

// Model
import { appointmentModel } from '../models/Appointment'

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

        const newAppointment = await appointmentModel.create({
            client: {
                _id: client._id,
                name: client.name,
                email: client.email,
            },
            selfEmployed,
            day,
            address,
        })

        Logger.info(`Novo agendamento criado por ${client.name}`)
        res.status(201).json({ appointment: newAppointment })
    } catch (error: any) {
        Logger.error(`Erro ao criar agendamento: ${error.message}`)
        res.status(500).json({ message: "Erro ao criar agendamento", error: error.message })
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
        Logger.error(`Failed to get appointments for user ${req.params.id}: ${error}`)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function acceptAppointment(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params
        const appointment = await appointmentModel.findById(id)

        if (!appointment) {
            res.status(404).json({ message: "Agendamento não encontrado" })
            return
        }

        appointment.acceptedBySelfEmployed = true
        await appointment.save()

        Logger.info(`Agendamento ${id} aceito pelo autônomo`)
        res.status(200).json({ message: "Agendamento aceito" })
    } catch (error: any) {
        Logger.error(`Erro ao aceitar agendamento: ${error.message}`)
        res.status(500).json({ message: "Erro ao aceitar agendamento", error: error.message })
    }
}

export async function rejectAppointment(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params
        const appointment = await appointmentModel.findById(id)

        if (!appointment) {
            res.status(404).json({ message: "Agendamento não encontrado" })
            return
        }

        appointment.acceptedBySelfEmployed = false
        appointment.status = "rejected"
        await appointment.save()

        Logger.info(`Agendamento ${id} rejeitado pelo autônomo`)
        res.status(200).json({ message: "Agendamento rejeitado" })
    } catch (error: any) {
        Logger.error(`Erro ao rejeitar agendamento: ${error.message}`)
        res.status(500).json({ message: "Erro ao rejeitar agendamento", error: error.message })
    }
}

export async function finishAppointment(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params
        const appointment = await appointmentModel.findById(id)

        if (!appointment) {
            res.status(404).json({ message: "Agendamento não encontrado" })
            return
        }

        appointment.status = "finished"
        await appointment.save()

        Logger.info(`Agendamento ${id} finalizado`)
        res.status(200).json({ message: "Agendamento finalizado" })
    } catch (error: any) {
        Logger.error(`Erro ao finalizar agendamento: ${error.message}`)
        res.status(500).json({ message: "Erro ao finalizar agendamento", error: error.message })
    }
}

export async function cancelAppointment(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params
        const deleted = await appointmentModel.findByIdAndDelete(id)

        if (!deleted) {
            res.status(404).json({ message: "Agendamento não encontrado" })
            return
        }

        Logger.info(`Agendamento ${id} cancelado pelo cliente`)
        res.status(200).json({ message: "Agendamento cancelado com sucesso" })
    } catch (error: any) {
        Logger.error(`Erro ao cancelar agendamento: ${error.message}`)
        res.status(500).json({ message: "Erro ao cancelar agendamento", error: error.message })
    }
}
