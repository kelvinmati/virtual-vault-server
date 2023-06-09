const express = require("express");
const router = express.Router();
const { createMessage } = require("../controller/message.js");

router.post("/send", createMessage);

module.exports = router;
