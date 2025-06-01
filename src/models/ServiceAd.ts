import { model, Schema, Types } from "mongoose";

const serviceAdSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        selfEmployed: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
)

export const ServiceAdModel = model("ServiceAd", serviceAdSchema);
