const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "users" },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "chats" },
    readBy: [{ type: Schema.Types.ObjectId, ref: "users" }]
  },
  {
    timestamps: true
  }
)

const MessageModel = model("messages", messageSchema);
module.exports = MessageModel