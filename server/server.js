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

// Define the port (Render sets PORT automatically; default to 5000 locally)
const PORT = process.env.PORT || 5000;

/**
 * Middleware
 * - Enable CORS for cross-origin requests
 * - Parse incoming JSON request bodies
 */
app.use(cors());
app.use(express.json());
app.use(require("./middleware/validateBody"));
/**
 * API Routes
 * - /api handles authentication routes (signup, login)
 * - /api/profile handles profile viewing and updating
 */
app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);

/**
 * Optional: Health check route to verify server is running
 */
app.get("/", (req, res) => {
    res.send("✅ Server is running");
});

/**
 * Connect to MongoDB and start the server
 * Logs server port if successful, logs error otherwise
 */
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
    });
