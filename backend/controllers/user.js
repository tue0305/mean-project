const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/user");

exports.createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashPassword,
    });
    await user.save();

    return res.status(201).json({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "Auth failed!",
      });
    }

    let isCorrectPassword = await bcrypt.compare(password, user.password)
    if (isCorrectPassword) {
      const token = jwt.sign({ email: user.email, userId: user._id }, "SECRET_TOKEN", {
        expiresIn: "1h"
      })

      return res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: user._id
      });
    } else {
      return res.status(400).json({
        message: "Password incorrect!!",
      });

    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
