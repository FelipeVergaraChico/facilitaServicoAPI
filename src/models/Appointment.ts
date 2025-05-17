import { model, Schema } from "mongoose";

const appointmentSchema = new Schema(
    {
        client: {
            _id: { type: Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            email: { type: String, required: true },
        },
        selfEmployed: {
            _id: { type: Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            email: { type: String, required: true },
        },
        day: { type: Date, required: true },
        hour: { type: String, required: true },
        address: { type: String, required: true },
        acceptedBySelfEmployed: { 
            type: Boolean, 
            default: null, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ["pending", "finished", "rejected"], 
            default: "pending", 
            required: true 
        },
    },
    { timestamps: true }
)

export const appointmentModel = model("Appointment", appointmentSchema)
