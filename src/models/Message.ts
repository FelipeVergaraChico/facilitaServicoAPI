import { model, Schema } from "mongoose"

const messageSchema = new Schema(
    {
        chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
        senderId: { type: String, ref: "User", required: true },
        message: { type: String, required: true }
    },
    { timestamps: true }
);

export const messageModel = model("Message", messageSchema)
