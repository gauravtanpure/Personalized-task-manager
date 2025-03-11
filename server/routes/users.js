const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Return user data (including _id) and token
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { name: newUser.name, email: newUser.email, _id: newUser._id }, // Include _id
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Return user data (including _id) and token
    res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email, _id: user._id }, // Include _id
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

module.exports = router;