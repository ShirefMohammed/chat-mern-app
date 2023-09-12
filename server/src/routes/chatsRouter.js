const express = require("express");
const { protect } = require("../middleware/authenticationMiddleware");
const {
  accessChat,
  fetchMyChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup
} = require("../controllers/chatsController");

const router = express.Router();

router.route("/accessChats").post(protect, accessChat);
router.route("/fetchMyChats").get(protect, fetchMyChats);
router.route("/createGroupChat").post(protect, createGroupChat);
router.route("/renameGroup").put(protect, renameGroup);
router.route("/removeFromGroup").put(protect, removeFromGroup);
router.route("/addToGroup").put(protect, addToGroup);

module.exports = router;