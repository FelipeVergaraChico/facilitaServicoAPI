import { Router } from "express"

// Controllers
import { listMessages, sendMessage } from "../controller/chatController"

// Middlewares
import verifyToken from "../middleware/verify-token"

// Validates
import { validate } from "../middleware/handleValidation"


const router = Router()

router.post("/:chatId/message", verifyToken, /* Validates */ sendMessage)

router.get("/:chatId/messages", verifyToken, listMessages)


export default router
