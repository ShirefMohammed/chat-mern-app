const express = require("express");
const { protect } = require("../middleware/authenticationMiddleware");
const {
  getUsers,
  getUserById,
  updatePortfolio
} = require("../controllers/usersControllers");

const router = express.Router();

// search users
router.route("/getUsers").get(protect, getUsers);

// get user by id
router.route("/getUser/userId/:userId").get(getUserById);

// update portfolio
router.route("/updatePortfolio").post(protect, updatePortfolio);

module.exports = router;