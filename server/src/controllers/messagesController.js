const UserModel = require("../models/userModel");
const ChatModel = require("../models/chatModel");
const MessageModel = require("../models/messageModel");

// send message
const sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    const newMessage = await MessageModel.create({
      sender: req.user._id,
      content: content,
      chat: chatId
    });

    const message = await MessageModel.findById(newMessage._id)
      .populate("sender", "name picture")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "name email picture",
        },
      });

    await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(200).json({ message: message });
  } catch (error) {
    next(error);
  }
};

// get chat messages
const getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chatMessages = await MessageModel.find({ chat: chatId })
      .populate("sender", "name email picture")
      .populate("chat");

    res.status(200).json({ chatMessages: chatMessages });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getChatMessages };