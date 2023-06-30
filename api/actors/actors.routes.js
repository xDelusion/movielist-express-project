const express = require("express");
const router = express.Router();
const uploader = require("../../middlewares/uploader");
const { getActor, addActor } = require("./actors.controllers");
const passport = require("passport");

router.get("/", getActor);
router.post("/", passport.authenticate("jwt", { session: false }), addActor);

module.exports = router;
