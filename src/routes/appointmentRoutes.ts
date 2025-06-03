import { Router } from "express"

// Controllers
import { acceptAppointment, cancelAppointment, createAppointment, finishAppointment, getAppointmentById, getAppointmentsByUserId, rejectAppointment } from "../controller/appointmentController"

// Middlewares
import verifyToken from "../middleware/verify-token"

// Validates


const router = Router()

router.post("/", verifyToken, createAppointment)

router.get("/:id", verifyToken, getAppointmentById)

router.get("/user/:id", verifyToken, getAppointmentsByUserId)

router.patch("/:id/accept", verifyToken, acceptAppointment)
router.patch("/:id/reject", verifyToken, rejectAppointment)
router.patch("/:id/finish", verifyToken, finishAppointment)

router.delete("/:id", verifyToken, cancelAppointment)


export default router
