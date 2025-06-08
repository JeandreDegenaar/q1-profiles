// middleware/auth.js

const jwt = require("jsonwebtoken");

/**
 * Middleware to protect private routes by validating JWT tokens.
 *
 * This function checks for a JWT in the `Authorization` header,
 * verifies it using the server's secret key, and attaches the
 * decoded user info to the `req` object if valid.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Callback to pass control to the next middleware
 * @returns {Object} - Returns 401 error if token is missing or invalid
 */
module.exports = (req, res, next) => {
    // Extract token from Authorization header
    const token = req.header("Authorization");

    // If no token is provided, deny access
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // Verify token and decode the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user ID and other info to request for future use
        req.user = decoded;

        // Continue to next middleware or route
        next();
    } catch {
        // If verification fails, deny access
        res.status(401).json({ message: "Invalid token" });
    }
};


