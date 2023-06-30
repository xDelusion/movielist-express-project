const express = require("express");
const router = express.Router();
const { getMovie, addMovie, reviewMovie } = require("./movies.controllers");
const passport = require("passport");

router.get("/", getMovie);
router.post("/", passport.authenticate("jwt", { session: false }), addMovie);
router.put(
  "/:movieId/add-review",
  passport.authenticate("jwt", { session: false }),
  reviewMovie
);

module.exports = router;
