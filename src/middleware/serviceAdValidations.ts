import { body } from "express-validator"

// Model


// Middlewares


export const createServiceAdValidation = () => {
    return [
        body("title")
            .notEmpty()
            .withMessage("O título é obrigatório")
            .isString()
            .withMessage("O título deve ser uma string"),

        body("description")
            .notEmpty()
            .withMessage("A descrição é obrigatória")
            .isString()
            .withMessage("A descrição deve ser uma string"),

        body("price")
            .notEmpty()
            .withMessage("O preço é obrigatório")
            .isFloat({ gt: 0 })
            .withMessage("O preço deve ser um número maior que 0"),

        body("category")
            .notEmpty()
            .withMessage("A categoria é obrigatória")
            .isString()
            .withMessage("A categoria deve ser uma string"),
    ]
}
