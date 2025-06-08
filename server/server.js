// server.js

// Load environment variables from .env file
require("dotenv").config();

// Import required libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import route handlers
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

// Create Express application
const app = express();

/**
 * Middleware
 * - Enable CORS for cross-origin requests
 * - Parse incoming JSON request bodies
 */
app.use(cors());
app.use(express.json());

/**
 * API Routes
 * - /api handles authentication routes (signup, login)
 * - /api/profile handles profile viewing and updating
 */
app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);

/**
 * Connect to MongoDB and start the server
 * Logs server URL if successful, logs error otherwise
 */
mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(process.env.PORT, () =>
        console.log(`✅ Server running on http://localhost:${process.env.PORT}`)
    ))
    .catch(err => console.error("❌ MongoDB connection error:", err));
