import { model, Schema } from "mongoose";

const appointmentSchema = new Schema(
    {
        client: {
            type: { name: String, email: String },
            required: true
        },
        selfEmployed: {
            type: { name: String, email: String },
            required: true
        },
        day: { type: Date, required: true },
        hour: { type: String, required: true },
        address: { type: String, required: true },
        acceptByAutonomous: { type: String, enum: ["yes", "no"], required: true },
        status: { type: String, enum: ["pending", "finished"], default: "pending", required: true },
    },
    { timestamps: true }
)

export const appointmentModel = model("Appointment", appointmentSchema)
