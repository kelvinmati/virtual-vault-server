const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const axios = require("axios");
const { generateToken, tokenForVerify } = require("../utils/token");
const dotenv = require("dotenv");
dotenv.config();
// register user
exports.signup = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(409).json({ message: "Email already exists" });
    } else {
      const saved_user = await User.create(req.body);

      res.status(201).json({ message: "User succesfully created", saved_user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

/**
 * 1. Check if Email and password are given
 * 2. Load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res

 */
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: "Please provide your credentials" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ error: "No user found. Please create an account" });
    }

    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({ error: "Password is not correct" });
    }
    const token = generateToken(user);
    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      message: "Successfully logged in",
      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

// confirmEmail
exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    }

    user.status = "active";
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    const accessToken = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully activated your account.",
      data: {
        user: others,
        token: accessToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

// forgetPassword
exports.forgetPassword = async (req, res) => {
  let WEB_URL = "http://localhost:5173";
  try {
    const { verifyEmail } = req.body;
    const user = await User.findOne({ email: verifyEmail });
    if (!user) {
      return res.status(404).send({
        message: "User Not found with this email!",
      });
    } else {
      const token = tokenForVerify(user);
      const apiKey = process.env.SEND_IN_BLUE_KEY;
      const url = process.env.SEND_IN_BLUE_URL;
      const headers = {
        "Content-Type": "application/json",
        "api-key": apiKey,
      };
      let body = {
        sender: {
          email: process.env.STORE_EMAIL,
        },
        to: [
          {
            email: `${verifyEmail}`,
          },
        ],
        subject: "Password Reset",
        replyTo: {
          email: process.env.STORE_EMAIL,
        },
        htmlContent: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <div >
            <h2>Hello ${verifyEmail}</h2>
           <p>A request has been received to change the password for your <strong>Virtual vault</strong> account </p>
    <strong>The link expires in 10 mins</strong>
           <p style="margin-bottom:20px;">Click on the reset password button below</p>
        <a href="${WEB_URL}/forgot-password/${token}"style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@virtualvault.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Virtual Vault Team</strong>
          </div>
        </body>
      </html>`,
      };
      user.confirmationToken = token;
      const date = new Date();
      date.setDate(date.getDate() + 1);
      user.confirmationTokenExpires = date;
      await user.save({ validateBeforeSave: false });

      await axios.post(url, body, { headers });
      res
        .status(201)
        .json({ message: "Please check your email to reset password!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

// confirm-forget-password
exports.confirmForgetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    } else {
      const newPassword = bcrypt.hashSync(password);
      await User.updateOne(
        { confirmationToken: token },
        { $set: { password: newPassword } }
      );

      user.confirmationToken = undefined;
      user.confirmationTokenExpires = undefined;

      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

// change password
exports.changePassword = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, googleSignIn, newPassword } = req.body || {};
    const user = await User.findOne({ email: email });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (googleSignIn) {
      const hashedPassword = bcrypt.hashSync(newPassword);
      await User.updateOne({ email: email }, { password: hashedPassword });
      return res.status(200).json({ message: "Password changed successfully" });
    }
    if (!bcrypt.compareSync(password, user?.password)) {
      return res.status(401).json({ message: "Incorrect current password" });
    } else {
      const hashedPassword = bcrypt.hashSync(newPassword);
      await User.updateOne({ email: email }, { password: hashedPassword });
      res.status(200).json({ message: "Password changed successfully" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

// update a profile
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.phone = req.body.phone;
      user.address = req.body.address;
      user.bio = req.body.bio;
      const updatedUser = await user.save();
      const token = generateToken(updatedUser);
      res.status(200).json({
        status: "success",
        message: "Successfully updated profile",
        data: {
          user: updatedUser,
          token,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({
      message: "Your email is not valid!",
    });
  }
};

// signUpWithProvider
exports.signUpWithProvider = async (req, res) => {
  try {
    const user = jwt.decode(req.params.token);
    const isAdded = await User.findOne({ email: user.email });
    if (isAdded) {
      const token = generateToken(isAdded);
      res.status(200).send({
        status: "success",
        data: {
          token,
          user: {
            _id: isAdded._id,
            name: isAdded.name,
            email: isAdded.email,
            address: isAdded.address,
            phone: isAdded.phone,
            imageURL: isAdded.imageURL,
            googleSignIn: true,
          },
        },
      });
    } else {
      const newUser = new User({
        name: user.name,
        email: user.email,
        imageURL: user.picture,
        status: "active",
      });

      const signUpUser = await newUser.save();
      // console.log(signUpUser)
      const token = generateToken(signUpUser);
      res.status(200).send({
        status: "success",
        data: {
          token,
          user: {
            _id: signUpUser._id,
            name: signUpUser.name,
            email: signUpUser.email,
            imageURL: signUpUser.imageURL,
            googleSignIn: true,
          },
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
