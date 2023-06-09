const express = require("express");
const { paymentIntent, addOrder } = require("../controller/order.controller");

// router
const router = express.Router();

// add a create payment intent
router.post("/create-payment-intent", paymentIntent);
// save Order
router.post("/saveOrder", addOrder); 

module.exports = router;
