const express = require("express");
const router = express.Router();
const { getGenre, addGenre } = require("./genres.controllers");
const passport = require("passport");

router.get("/", getGenre);
router.post("/", passport.authenticate("jwt", { session: false }), addGenre);

module.exports = router;
