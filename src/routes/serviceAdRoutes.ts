import { Router } from "express"

// Controllers
import { createServiceAd, deleteServiceAd, editServiceAd, getAllServiceAd, getServiceAdById, getServiceAdByUser } from "../controller/serviceAdController"

// Middlewares
import verifyToken from "../middleware/verify-token"

// Validates
import { validate } from "../middleware/handleValidation"
import { createServiceAdValidation, editServiceAdValidation } from "../middleware/serviceAdValidations"

const router = Router()

router.post("/", verifyToken, createServiceAdValidation(), validate, createServiceAd)

router.get("/user/:userId", getServiceAdByUser)
router.get("/", getAllServiceAd)
router.get("/:id", getServiceAdById)

router.patch("/:id", verifyToken, editServiceAdValidation(), validate, editServiceAd)

router.delete("/:id", verifyToken, deleteServiceAd)

export default router
