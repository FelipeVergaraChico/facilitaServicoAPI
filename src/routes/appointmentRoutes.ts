import { Router } from "express"

// Controllers


// Middlewares
import verifyToken from "../middleware/verify-token"

// Validates


const router = Router()

router.post("/", verifyToken, /* Create Appointment */)

router.get("/:id", verifyToken, /* Get Details of an Appointment */)

router.get("/client/:id", verifyToken, /* View Appointments by Client Id */)
router.get("/selfemployed/:id", verifyToken, /* View Appointments by selfemployed Id */)

router.patch("/:id/accept", verifyToken, /* Self Employed Accept Appointment */)
router.patch("/:id/reject", verifyToken, /* Self Employed Reject Appointment */)
router.patch("/:id/finish", verifyToken, /* Self Employed Finish Appointment */)

router.delete("/:id", verifyToken, /* Client cancel Appointment */)


export default router
