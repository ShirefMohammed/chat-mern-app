const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel");

// signUp
const signUp = async (req, res, next) => {
  try {
    const { name, email, password, picture } = req.body;

    const existingUser = await UserModel.findOne({ email: email });

    if (existingUser) {
      return res.status(200).json({
        created: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name: name,
      email: email,
      password: hashedPassword,
      picture: picture,
    });

    await newUser.save();

    res.status(200).json({
      created: true,
      message: "Account created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// signIn
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(200).json({ message: "Account not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(200).json({
        message: "Email or password is incorrect",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token: token,
      mainUserId: user._id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signUp, signIn };