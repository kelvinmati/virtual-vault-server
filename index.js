const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
// const connectDB = require("./config/db");
const mongoose = require("mongoose");
// import routes
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const userOrderRoutes = require("./routes/user.order.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const couponRoutes = require("./routes/coupon.routes");
const reviewRoutes = require("./routes/review.routes");
const messageRoutes = require("./routes/message.js");

// const uploadRouter = require('./routes/uploadFile.route');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// db connection
// const connectDB = async () => {
//   mongoose
//     .connect(`${process.env.MONGO_URL}`)
//     .then(() => console.log("Database Connected"))
//     .catch((err) => console.log(err));
// };

mongoose
  .connect(`${process.env.MONGO_URL}`)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));
// routes middleware
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/product", productRoutes);
// app.use('/api/upload',uploadRouter);
app.use("/api/order", orderRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/user-order", userOrderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/message", messageRoutes);

// root route
app.get("/", (req, res) => res.send("Apps worked successfully"));

// use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

const PORT = 7000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

module.exports = app;
// module.exports = connectDB;
