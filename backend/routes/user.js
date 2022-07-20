const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/user");
const router = express.Router();
const userController = require("../controllers/user")

router.post("/signup", userController.createUser);
router.post("/login", userController.login);

module.exports = router;
