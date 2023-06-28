const express = require("express");
const router = express.Router();
const uploader = require("../../middlewares/uploader");
const { getMovie, addMovie } = require("./movies.controllers");

router.get("/", getMovie);
router.post("/", addMovie);

module.exports = router;
