const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

// search users
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;

    const keyword = search ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    } : {};

    const users = await UserModel.find(keyword)
      .find({ _id: { $ne: req.user._id } });

    res.status(200).json({ users: users });
  } catch (error) {
    next(error);
  }
}

// get user by id
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId, "-password");

    user && res.status(200).json({ user: user });
  } catch (error) {
    next(error);
  }
}

// update portfolio
const updatePortfolio = async (req, res, next) => {
  try {
    const { name, email, picture } = req.body;

    const hasSameEmail = await UserModel.findOne({ email: email });

    if (hasSameEmail) {
      res.status(200).json({
        updated: false,
        message: "email exists in database"
      });
    }

    const user = await UserModel.findById(req.user._id);

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (picture) {
      user.picture = picture;
    }

    await user.save();

    res.status(200).json({
      updated: true,
      user: user,
      message: "account updated successfully"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getUsers, getUserById, updatePortfolio };