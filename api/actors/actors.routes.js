const express = require("express");
const router = express.Router();
const uploader = require("../../middlewares/uploader");
const { getActor, addActor } = require("./actors.controllers");

router.get("/", getActor);
router.post("/", addActor);

module.exports = router;
