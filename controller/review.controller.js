const mongoose = require("mongoose");
const Order = require("../model/Order");
const Products = require("../model/Products");
const Reviews = require("../model/Review");
const User = require("../model/User");

// add a review
exports.addReview = async (req, res) => {
  const { userId, productId, rating, comment } = req.body;
  try {
    // Check if the user has already left a review for this product
    const existingReview = await Reviews.findOne({
      user: userId,
      product: productId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already left a review for this product." });
    }
    const checkPurchase = await Order.findOne({
      user: new mongoose.Types.ObjectId(userId),
      "cart._id": { $in: [productId] },
    });
    if (!checkPurchase) {
      return res
        .status(400)
        .json({ message: "Without purchase you can not give here review!" });
    }

    // Create the new review
    const review = new Reviews(req.body);

    // Save the review to the database
    await review.save();

    // Add the review to the product's reviews array
    const product = await Products.findById(productId);
    product.reviews.push(review._id);
    await product.save();

    // Add the review to the user's reviews array
    const user = await User.findById(userId);
    user.reviews.push(review._id);
    await user.save();

    return res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
};
