import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    product: {
      type: String,
    },
    category: {
      type: String,
    },
    response: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema)
