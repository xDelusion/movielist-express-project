const express = require("express");
const router = express.Router();
const { getMovie, addMovie } = require("./movies.controllers");
const passport = require("passport");

router.get("/", getMovie);
router.post("/", passport.authenticate("jwt", { session: false }), addMovie);

module.exports = router;
