const express = require("express");
const router = express.Router();
const { getGenre, addGenre } = require("./genres.controllers");

router.get("/", getGenre);
router.post("/", addGenre);

module.exports = router;
