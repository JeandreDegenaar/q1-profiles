// models/User.js
const mongoose = require("mongoose");
const { isInvalid } = require("../utils/sanitise");
/**
 * Mongoose schema definition for the User collection.
 * Stores user credentials and profile information.
 */
const userSchema = new mongoose.Schema({
    /**
     * @property {String} username - Required unique login name. Trimmed to remove whitespace.
     */
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (v) => !isInvalid(v) && /^[A-Za-z0-9_.-]{3,30}$/.test(v), message: "Username cannot contain spaces, emoji, and must be 3–30 safe chars",
         },
    },

    /**
     * @property {String} password - Hashed user password (stored securely).
     */
    password: {
        type: String,
        required: true
    },

    /**
     * @property {String} email - User's email (unique, required, lowercase).
     */
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    /**
     * @property {String} phone - Optional 10-digit phone number (numeric only).
     */
    phone: {
        type: String,
        match: /^\d{10}$/
    },

    /**
     * @property {Date} dob - Date of birth (required).
     */
    dob: {
        type: Date,
        required: true
    }
});

/**
 * Export the User model to be used in authentication and profile routes.
 */
module.exports = mongoose.model("User", userSchema);

