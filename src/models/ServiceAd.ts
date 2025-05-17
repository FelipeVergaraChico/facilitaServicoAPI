import { model, Schema } from "mongoose";

const serviceAdSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        selfEmployed: {
            _id: { type: Schema.Types.ObjectId, required: true },  // Usando _id ao invés de id
            name: { type: String, required: true },
            email: { type: String, required: true },
        }
    },
    { timestamps: true }
)

export const ServiceAdModel = model("ServiceAd", serviceAdSchema);
