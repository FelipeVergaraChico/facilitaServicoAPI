import { Request, Response } from 'express'

// Model
import { ServiceAdModel } from '../models/ServiceAd'

// Logger
import Logger from "../../config/logger"

// Middlewares
import getToken from '../middleware/get-token'
import getUserByToken from '../middleware/get-user-by-token'

export async function createServiceAd(req: Request, res: Response): Promise<void> {
    try {
        const { title, description, price, category } = req.body

        // Get token and User Autenticated
        const token = getToken(req)
        const user = await getUserByToken(token)

        // Create the service ad
        const serviceAd = new ServiceAdModel({
            title,
            description,
            price,
            category,
            selfEmployed: user._id,
        })

        const savedAd = await serviceAd.save()

        Logger.info(`Usuário ${user.name} com id ${user._id} criou um serviço`);

        res.status(201).json({
            message: "Anúncio criado com sucesso!",
            serviceAd: savedAd,
        })

    } catch (error: any) {
        res.status(500).json({ message: "Erro ao criar o anúncio", error: error.message })
    }
}

export async function getServiceAdByUser(req: Request, res: Response): Promise<void> {
    try {
        const { userId } = req.params

        const serviceAds = await ServiceAdModel.find({ selfEmployed: userId })

        if (serviceAds.length === 0) {
            res.status(404).json({ message: "Nenhum anúncio encontrado para esse usuário." })
            return
        }

        res.status(200).json({ serviceAds })

    } catch (error: any) {
        res.status(500).json({ message: "Erro ao buscar anúncios do usuário", error: error.message })
    }
}

export async function getAllServiceAd(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 10, category } = req.query

    const pageNumber = parseInt(page as string, 10)
    const limitNumber = parseInt(limit as string, 10)
    const skip = (pageNumber - 1) * limitNumber

    const filter: any = {}
    if (category) {
        filter.category = category
    }

    try {
        const total = await ServiceAdModel.countDocuments(filter)
        const serviceAds = await ServiceAdModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)
            .populate("selfEmployed", "name email")

        res.status(200).json({
            serviceAds,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
        })
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao buscar anúncios", error: error.message })
    }
}

export async function getServiceAdById(req: Request, res: Response): Promise<void> {
    try {

    } catch (error: any) {

    }
}

export async function editServiceAd(req: Request, res: Response): Promise<void> {
    try {

    } catch (error: any) {

    }
}

export async function deleteServiceAd(req: Request, res: Response): Promise<void> {
    try {

    } catch (error: any) {

    }
}
