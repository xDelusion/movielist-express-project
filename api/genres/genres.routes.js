const express = require("express");
const router = express.Router();
const { getGenre, addGenre, updateGenre } = require("./genres.controllers");
const passport = require("passport");

router.get("/", getGenre);
router.post("/", passport.authenticate("jwt", { session: false }), addGenre);
router.put(
  "/:genreId",
  passport.authenticate("jwt", { session: false }),
  updateGenre
);

module.exports = router;
