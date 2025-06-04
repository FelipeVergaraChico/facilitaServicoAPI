import { Router } from "express"

// Controllers
import { getChatsByUser, listMessages, sendMessage } from "../controller/chatController"

// Middlewares
import verifyToken from "../middleware/verify-token"

// Validates
import { validate } from "../middleware/handleValidation"
import { sendMessageValidation } from "../middleware/chatValidations"


const router = Router()

router.get("/", verifyToken, getChatsByUser)

router.post("/:chatId/message", verifyToken, sendMessageValidation(), validate, sendMessage)

router.get("/:chatId/messages", verifyToken, listMessages)


export default router
