const express = require("express");
const { protect } = require("../middleware/authenticationMiddleware");
const {
  sendMessage,
  getChatMessages
} = require("../controllers/messagesController");

const router = express.Router();

// send message
router.route("/sendMessage").post(protect, sendMessage);

// get chat messages
router.route("/getChatMessages/:chatId").get(protect, getChatMessages);

module.exports = router