const express = require("express");
const router = express.Router();
const uploader = require("../../middlewares/uploader");
const { signUp, signIn, getProfile } = require("./auth.controllers");
const passport = require("passport");

router.post("/signup", uploader.single("profileImage"), signUp);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signIn
);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getProfile
);

module.exports = router;
