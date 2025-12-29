import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get user by Stellar address
router.get("/:address", async (req, res) => {
  try {
    const user = await User.findOne({ stellarAddress: req.params.address })
      .populate("projects")
      .populate("donations");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update user
router.post("/", async (req, res) => {
  try {
    const { stellarAddress, name, email, bio, role, social } = req.body;

    let user = await User.findOne({ stellarAddress });

    if (user) {
      // Update existing user
      user = await User.findOneAndUpdate(
        { stellarAddress },
        { name, email, bio, role, social },
        { new: true, runValidators: true }
      );
    } else {
      // Create new user
      user = new User({
        stellarAddress,
        name,
        email,
        bio,
        role,
        social,
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user statistics
router.get("/:address/stats", async (req, res) => {
  try {
    const user = await User.findOne({ stellarAddress: req.params.address });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user projects
router.get("/:address/projects", async (req, res) => {
  try {
    const user = await User.findOne({
      stellarAddress: req.params.address,
    }).populate("projects");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user donations
router.get("/:address/donations", async (req, res) => {
  try {
    const user = await User.findOne({
      stellarAddress: req.params.address,
    }).populate({
      path: "donations",
      populate: { path: "project", select: "title slug" },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
