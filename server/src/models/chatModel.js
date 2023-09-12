const { Schema, model } = require("mongoose");

const chatSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "users" }],
    latestMessage: { type: Schema.Types.ObjectId, ref: "messages" },
    isGroupChat: { type: Boolean, default: false },
    groupName: { type: String, trim: true },
    groupAdmin: { type: Schema.Types.ObjectId, ref: "users" }
  },
  {
    timestamps: true
  }
);

const ChatModel = model("chats", chatSchema);

module.exports = ChatModel;