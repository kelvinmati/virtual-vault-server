const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const CategorySchema = mongoose.Schema(
  {
    img: {
      type: String,
      required: false,
    },
    parent: {
      type: String,
      required: true,
      trim: true,
    },
    children: [{ type: String }],
    productType: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    products: [
      {
        type: ObjectId,
        ref: "Products",
      },
    ],
    status: {
      type: String,
      enum: ["Show", "Hide"],
      default: "Show",
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
