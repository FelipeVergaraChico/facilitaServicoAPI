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

        if (user.position !== "Self-employed") {
            res.status(403).json({ message: "Apenas usuários autônomos podem criar anúncios de serviço" })
            return
        }

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
    const { id } = req.params;

    try {
        const serviceAd = await ServiceAdModel.findById(id).populate("selfEmployed", "-password");

        if (!serviceAd) {
            res.status(404).json({ message: "Serviço não encontrado" });
            return;
        }

        res.status(200).json(serviceAd);
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao buscar o serviço", error: error.message });
    }
}

export async function editServiceAd(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params

        // Verify Ad Exists
        const serviceAd = await ServiceAdModel.findById(id)
        if (!serviceAd) {
            res.status(404).json({ message: "Anúncio de serviço não encontrado." })
            return;
        }

        // Verify Permission
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (serviceAd.selfEmployed.toString() !== user._id.toString()) {
            res.status(403).json({ message: "Você não tem permissão para editar este anúncio." })
            return
        }

        // Update
        const { title, description, price, category } = req.body

        serviceAd.title = title
        serviceAd.description = description
        serviceAd.price = price
        serviceAd.category = category

        await serviceAd.save()

        res.status(200).json({ message: "Anúncio atualizado com sucesso", serviceAd })

    } catch (error: any) {
        res.status(500).json({ message: "Erro ao atualizar o anúncio", error: error.message })
    }
}

export async function deleteServiceAd(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    try {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const serviceAd = await ServiceAdModel.findById(id)

        if (!serviceAd) {
            res.status(404).json({ message: "Serviço não encontrado." })
            return
        }

        if (serviceAd.selfEmployed.toString() !== user._id.toString()) {
            res.status(403).json({ message: "Você não tem permissão para deletar este anúncio." })
            return
        }

        await ServiceAdModel.findByIdAndDelete(id)

        Logger.info(`Usuário ${user.name} (ID: ${user._id}) excluiu o anúncio de serviço com ID ${serviceAd._id}`)


        res.status(200).json({ message: "Serviço deletado com sucesso." })
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao deletar o serviço.", error: error.message })
    }
}
