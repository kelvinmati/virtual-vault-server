const express = require("express");
const router = express.Router();
const { addReview } = require("../controller/review.controller");

// add a review
router.post("/add", addReview);

module.exports = router;
