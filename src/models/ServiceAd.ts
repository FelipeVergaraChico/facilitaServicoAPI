import { model, Schema } from "mongoose";

const serviceAdSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        selfEmployed: {
            type: { name: String, email: String },
            required: true
        }
    },
    { timestamps: true }
)

export const ServiceAdModel = model("ServiceAd", serviceAdSchema);
