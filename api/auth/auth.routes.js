const express = require("express");
const router = express.Router();
const uploader = require("../../middlewares/uploader");
const { signUp, signIn } = require("./auth.controllers");
const passport = require("passport");

router.post("/signup", uploader.single("profileImage"), signUp);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signIn
);

module.exports = router;
