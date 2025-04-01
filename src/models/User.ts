import {model, Schema} from "mongoose";

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        cpfcnpj: { type: String, required: true },
        address: { type: String, required: true },
        cep: { type: String, required: true },
        birthday: { type: Date, required: true },
        position: { type: String, default: "Member", required: true },
    },
    { timestamps: true }
)

export const UserModel = model("User", userSchema)
