const UserModel = require("../models/userModel");
const ChatModel = require("../models/chatModel");

const accessChat = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId is not sent with request");
      return res.sendStatus(400);
    }

    const chat = await ChatModel.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name",
        },
      });

    if (chat) {
      res.status(200).json({ chat: chat });
    } else {
      const createdChat = await ChatModel.create({
        users: [req.user._id, userId],
        isGroupChat: false
      });

      const chat = await ChatModel.findOne({ _id: createdChat._id })
        .populate("users", "-password");

      res.status(200).json({ chat: chat });
    }
  } catch (error) {
    next(error)
  }
};

const fetchMyChats = async (req, res, next) => {
  try {
    const chats = await ChatModel.find({
      users: { $elemMatch: { $eq: req.user._id } }
    })
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name"
        }
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({ chats: chats });
  } catch (error) {
    next(error);
  }
};

const createGroupChat = async (req, res, next) => {
  if (!req.body.users || !req.body.groupName) {
    return res.status(400).json({ message: "Please Fill all the fields" });
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400)
      .json({ message: "More than 2 users are required to form a group chat" });
  }

  users.push(req.user);

  try {
    const groupChat = await ChatModel.create({
      users: users,
      isGroupChat: true,
      groupName: req.body.name,
      groupAdmin: req.user
    });

    const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id });

    res.status(200).json({ fullGroupChat: fullGroupChat });
  } catch (error) {
    next(error);
  }
};

const renameGroup = async (req, res, next) => {
  const { chatId, groupName } = req.body;

  // check if the requester is admin
  const groupChat = await ChatModel.findById(chatId);

  if (groupChat.groupAdmin != req.user._id) {
    return res.status(200).json({
      message: "only admin can change group settings"
    });
  }

  const updatedChat = await ChatModel.findByIdAndUpdate(
    chatId,
    { groupName: groupName },
    { new: true }
  );

  if (updatedChat) {
    res.status(200).json({ updatedChat: updatedChat });
  } else {
    next(new Error("Chat Not Found"));
  }
};

const addToGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin
  const groupChat = await ChatModel.findById(chatId);

  if (groupChat.groupAdmin != req.user._id) {
    return res.status(200).json({
      message: "only admin can change group settings"
    });
  }

  const added = await ChatModel.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password");

  if (added) {
    res.status(200).json({ added: added });
  } else {
    next(new Error("Chat Not Found"));
  }
};

const removeFromGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin
  const groupChat = await ChatModel.findById(chatId);

  if (groupChat.groupAdmin != req.user._id) {
    return res.status(200).json({
      message: "only admin can change group settings"
    });
  }

  const removed = await ChatModel.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true, }
  )
    .populate("users", "-password");

  if (removed) {
    res.status(200).json({ removed: removed });
  } else {
    next(new Error("Chat Not Found"));
  }
};

module.exports = {
  accessChat,
  fetchMyChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup
};