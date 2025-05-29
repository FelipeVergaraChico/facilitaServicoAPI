import { body } from "express-validator"

// Model
import { UserModel } from "../models/User"


// import Logger from "../../config/logger";

export const userCreateValidation = () => {
    return [
        body("name")
            .isString()
            .withMessage("O nome é obrigatório")
            .isLength({ min: 3 })
            .withMessage("O nome precisa ter, no mínimo, 3 caracteres")
            .matches(/^[A-Za-zÀ-ÿ\s]+$/)
            .withMessage("O nome deve conter apenas letras"),
        body("email")
            .isEmail()
            .withMessage("Por favor, insira um e-mail válido")
            .custom(async (value) => {
                const existingUser = await UserModel.findOne({ email: value });
                if (existingUser) {
                    throw new Error("Esse e-mail já está em uso");
                }
                return true;
            }),
        body("job")
            .optional()
            .isString()
            .withMessage("O campo 'job' deve ser uma string"),
        body("password")
            .isString()
            .withMessage("A senha é obrigatória")
            .isLength({ min: 6 })
            .withMessage("A senha precisa ter no mínimo 6 caracteres"),
        body("confirmpassword")
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("A senha e a confirmação de senha precisam ser iguais");
                }
                return true;
            }),
        body("cpfcnpj")
            .isString()
            .withMessage("O campo CPF/CNPJ é obrigatório")
            .matches(/^\d{11}$|^\d{14}$/)
            .withMessage("O CPF deve conter 11 dígitos e o CNPJ 14 dígitos"),
        body("address")
            .isString()
            .withMessage("O endereço é obrigatório")
            .isLength({ min: 5 })
            .withMessage("O endereço deve ter no mínimo 5 caracteres"),
        body("cep")
            .isString()
            .withMessage("O CEP é obrigatório")
            .matches(/^\d{5}-?\d{3}$/)
            .withMessage("O CEP deve ter 8 dígitos (com ou sem hífen)"),
        body("birthday")
            .isISO8601()
            .withMessage("A data de nascimento deve ser uma data válida no formato AAAA-MM-DD")
            .custom((value) => {
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 13) {
                    throw new Error("O usuário deve ter pelo menos 13 anos");
                }
                return true;
            }),
        body("position")
            .isString()
            .withMessage("O campo posição é obrigatório")
            .custom((value) => {
                if (value !== "Client" && value !== "Self-employed") {
                    throw new Error("Posição inválida")
                }
            })
    ]
}

export const userLoginValidation = () => {
    return [
        body("email")
            .isEmail()
            .withMessage("Por favor, insira um e-mail válido"),
        body("password")
            .isString()
            .withMessage("A senha é obrigatória")
            .isLength({ min: 6 })
            .withMessage("A senha precisa ter no mínimo 6 caracteres"),
    ]
}

export const userEditValidation = () => {
    return [
        body("name")
            .isString()
            .withMessage("O nome precisa ser uma string")
            .isLength({ min: 3 })
            .withMessage("O nome precisa ter no mínimo 3 caracteres")
            .matches(/^[A-Za-zÀ-ÿ\s]+$/)
            .withMessage("O nome deve conter apenas letras"),

        body("email")
            .isEmail()
            .withMessage("Por favor, insira um e-mail válido")
            .custom(async (value, { req }) => {
                const existingUser = await UserModel.findOne({ email: value });
                const userId = req.params?.id ?? "";

                if (existingUser && existingUser._id.toString() !== userId) {
                    throw new Error("Esse e-mail já está em uso");
                }
                return true;
            }),

        body("job")
            .optional()
            .isString()
            .withMessage("O campo 'job' deve ser uma string"),

        body("password")
            .isString()
            .withMessage("A senha deve ser uma string")
            .isLength({ min: 6 })
            .withMessage("A senha precisa ter no mínimo 6 caracteres"),
        
        body("confirmpassword")
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("A senha e a confirmação de senha precisam ser iguais");
                }
                return true;
            }),
        
        body("cpfcnpj")
            .isString()
            .withMessage("O campo CPF/CNPJ deve ser uma string")
            .matches(/^\d{11}$|^\d{14}$/)
            .withMessage("O CPF deve conter 11 dígitos e o CNPJ 14 dígitos"),

        body("address")
            .isString()
            .withMessage("O endereço deve ser uma string")
            .isLength({ min: 5 })
            .withMessage("O endereço deve ter no mínimo 5 caracteres"),

        body("cep")
            .isString()
            .withMessage("O CEP deve ser uma string")
            .matches(/^\d{5}-?\d{3}$/)
            .withMessage("O CEP deve ter 8 dígitos (com ou sem hífen)"),
    ];
};
