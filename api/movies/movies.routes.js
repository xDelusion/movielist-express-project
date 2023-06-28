const express = require("express");
const router = express.Router();
const uploader = require("../../middlewares/uploader");
const { movieGet, createMovie } = require("./movies.controllers");

router.get("/", movieGet);
router.post("/", createMovie);

module.exports = router;
