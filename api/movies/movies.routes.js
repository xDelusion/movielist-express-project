const express = require("express");
const router = express.Router();
const uploader = require("../../middlewares/uploader");
const { movieGet } = require("./movies.controller");

router.post("/", movieGet);

module.exports = router;
