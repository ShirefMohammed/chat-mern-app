const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    picture: {
      type: "String",
      required: true,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true
  }
);

const UserModel = model("users", userSchema);
module.exports = UserModel;