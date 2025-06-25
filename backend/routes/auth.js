import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered. Please login instead." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("User registered Succesfully");
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.log("error registering",error);
    res
      .status(500)
      .json({ message: "Error registering user.", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please register first." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days expiry
    });

    console.log("Logged in succesfully");
    res
      .status(200)
      .json({
        message: "Login successful.",
        user: { username: user.username, email: user.email },
      });
  } catch (error) {
    console.log("Error in logging in",error);
    res
      .status(500)
      .json({ message: "Error logging in.", error: error.message });
  }
});

export default router;
