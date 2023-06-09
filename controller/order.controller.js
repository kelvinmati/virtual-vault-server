const stripe = require("stripe")(process.env.STRIPE_KEY);
const Order = require("../model/Order");

// create-payment-intent
exports.paymentIntent = async (req, res) => {
  try {
    const product = req.body;
    const price = Number(product.price);
    const amount = price * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: amount,
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: error?.message,
    });
  }
};
// addOrder
exports.addOrder = async (req, res) => {
  try {
    const orderItems = await Order.create(req.body);

    res.status(200).json({
      success: true,
      message: "Order added successfully",
      order: orderItems,
    });
  } 
  catch (err) {
    console.log(err);
    res.send({
      message: err?.message,
    });
  }
};
