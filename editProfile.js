const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.put("/:id", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required." });
    }

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prepare data to be updated
    const updatedData = {};

    if (username) updatedData.username = username;
    if (email) updatedData.email = email;

    // If password is provided, hash it before updating
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedData.password = hashedPassword;
    }

    // Update user data in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );

    // If no update was made
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update the user profile." });
    }

    console.log("Updated user:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
});

module.exports = router;