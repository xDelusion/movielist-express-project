const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../../db/models/User");

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const createToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });
  return token;
};

exports.signUp = async (req, res, next) => {
  try {
    // overwrite and hash password
    const { password } = req.body;
    req.body.password = await hashPassword(password);

    // Create User
    const newUser = await User.create(req.body);

    // Create token
    const token = createToken(newUser);

    // return token
    return res.status(201).json(token);
  } catch (error) {
    next(error);
  }
};

exports.signIn = (req, res, next) => {
  const token = createToken(req.user);
  console.log(req.user);
  return res.status(200).json({ token });
};
