import { model, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    appointmentId: { 
      type: Schema.Types.ObjectId, 
      ref: "Appointment",
      required: true,
    },
  },
  { timestamps: true }
);

export const chatModel = model("Chat", chatSchema);
