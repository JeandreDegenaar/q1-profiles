// routes/profile.js

const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @route   GET /api/profile
 * @desc    Fetch the currently logged-in user's profile
 * @access  Private (requires valid JWT token)
 *
 * Returns: { username, email, phone, dob }
 */
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("username email phone dob");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("❌ Fetch profile error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   PUT /api/profile
 * @desc    Update the logged-in user's profile
 * @access  Private (requires valid JWT token)
 *
 * Accepts: username, email, phone, dob
 * Returns: Updated user document
 */
router.put("/", auth, async (req, res) => {
    const { username, email, phone, dob } = req.body;

    // Validate all required fields
    if (!username || !email || !phone || !dob) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username, email, phone, dob },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error("❌ Profile update error:", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
});

module.exports = router;
