/**
 * Login.jsx
 * ----------
 * This React component renders a user login form and handles:
 * - Client-side form validation
 * - API request to the backend for authentication
 * - Local storage of JWT token on successful login
 * - Redirect to profile page after login
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Main component
export default function Login() {
    // State to track form input values
    const [form, setForm] = useState({ username: "", password: "" });

    // State to hold individual field validation errors
    const [errors, setErrors] = useState({});

    // State to hold a generic submission error (e.g., incorrect credentials)
    const [submitError, setSubmitError] = useState("");

    // Hook from React Router to programmatically navigate between pages
    const navigate = useNavigate();

    /**
     * Function to validate a single field
     * @param {string} name - field name (e.g., "username")
     * @param {string} value - field value
     * @returns {string} - validation error message or empty string if valid
     */
    const validateField = (name, value) => {
        switch (name) {
            case "username":
                return value.trim() ? "" : "Username is required";
            case "password":
                return value.length >= 6 ? "" : "Password must be at least 6 characters";
            default:
                return "";
        }
    };

    /**
     * Handles form field changes and runs live validation
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form state
        setForm({ ...form, [name]: value });

        // Immediately validate the changed field
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    /**
     * Handles form submission
     * Performs validation, then sends login request to backend
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent browser default form submission behavior

        // Manually validate all fields before submit
        const newErrors = {};
        for (const field in form) {
            const error = validateField(field, form[field]);
            if (error) newErrors[field] = error;
        }

        // If there are any errors, set them and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // POST login data to backend
            const res = await axios.post("http://localhost:5000/api/login", form);

            // Save the JWT token in local storage
            localStorage.setItem("token", res.data.token);

            // Redirect user to the profile page
            navigate("/profile");
        } catch (err) {
            // Show user-friendly error if login fails
            setSubmitError("Invalid username or password");
        }
    };

    /**
     * Renders the login form UI
     */
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-center">Login</h2>

                    {/* Show generic login failure error */}
                    {submitError && (
                        <p className="text-red-500 text-sm text-center">{submitError}</p>
                    )}

                    {/* Loop through "username" and "password" to generate fields */}
                    {["username", "password"].map((field) => (
                        <div key={field}>
                            <input
                                type={field === "password" ? "password" : "text"}
                                name={field}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                value={form[field]}
                                onChange={handleChange}
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                                    errors[field]
                                        ? "border-red-500 focus:ring-red-400"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />
                            {/* Inline error message below the input */}
                            {errors[field] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                            )}
                        </div>
                    ))}

                    {/* Submit button */}
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-semibold"
                        type="submit"
                    >
                        Login
                    </button>

                    {/* Signup link */}
                    <p className="text-center text-sm">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

