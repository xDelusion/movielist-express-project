const express = require("express");
const router = express.Router();
const {
  getMovie,
  addMovie,
  reviewMovie,
  addToWatchlist,
  getWatchlist,
  updateWatchlist,
  updateMovie,
  deleteMovie,
} = require("./movies.controllers");
const passport = require("passport");

router.get("/", getMovie);
router.post("/", passport.authenticate("jwt", { session: false }), addMovie);
router.post(
  "/:movieId/add-review",
  passport.authenticate("jwt", { session: false }),
  reviewMovie
);
router.put(
  "/:movieId",
  passport.authenticate("jwt", { session: false }),
  updateMovie
);
router.delete(
  "/:movieId",
  passport.authenticate("jwt", { session: false }),
  deleteMovie
);

// Watchlist Routes
router.post(
  "/:movieId",
  passport.authenticate("jwt", { session: false }),
  addToWatchlist
);

router.get(
  "/watchlist",
  passport.authenticate("jwt", { session: false }),
  getWatchlist
);

router.put(
  "/:movieId",
  passport.authenticate("jwt", { session: false }),
  updateWatchlist
);

module.exports = router;
