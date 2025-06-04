import { body } from "express-validator"

export const sendMessageValidation = () => {
    return [
        body("message")
            .notEmpty()
            .withMessage("A mensagem é obrigatória")
            .isString()
            .withMessage("A mensagem tem que ser uma string")
    ]
}