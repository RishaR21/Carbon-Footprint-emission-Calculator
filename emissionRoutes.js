const express = require("express");
const Emission = require("../models/Emission");
const router = express.Router();

// Save emission data
router.post("/save", async (req, res) => {
  try {
    const { userId, category, emissionValue, details } = req.body;

    const newEmission = new Emission({
      userId,
      category,
      emissionValue,
      details,
    });

    await newEmission.save();
    res.status(201).json({ message: "Emission data saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch emissions for user dashboard
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const emissions = await Emission.find({ userId }).sort({ createdAt: -1 });

    res.json(emissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;