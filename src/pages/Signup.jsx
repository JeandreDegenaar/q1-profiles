/**
 * Signup.jsx
 * ----------
 * This component handles user registration.
 * It includes client-side validation and sends the signup request to the backend.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
    // State to hold form field values
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
        dob: "",
    });

    // Error state for individual fields and submission
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    const navigate = useNavigate();

    /**
     * Validates a single field and returns an error message (if any)
     */
    const validateField = (name, value) => {
        switch (name) {
            case "username":
                return value.trim() ? "" : "Username is required";
            case "password":
                return value.length >= 6 ? "" : "Password must be at least 6 characters";
            case "email":
                return /^\S+@\S+\.\S+$/.test(value) ? "" : "Invalid email format";
            case "phone":
                return /^\d+$/.test(value) ? "" : "Phone must contain only numbers";
            case "dob":
                return value ? "" : "Date of birth is required";
            default:
                return "";
        }
    };

    /**
     * Handles input change and real-time validation
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Update validation error for current field
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    /**
     * Handles form submission
     * - Performs full form validation
     * - Sends signup request
     * - Stores JWT token in localStorage
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Run validation for all fields
        const newErrors = {};
        for (const field in form) {
            const error = validateField(field, form[field]);
            if (error) newErrors[field] = error;
        }

        // If errors exist, stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const res = await axios.post("https://q1-profiles.onrender.com/api/signup", form);
            localStorage.setItem("token", res.data.token); // Save token for authentication
            navigate("/profile"); // Redirect after success
        } catch (err) {
            // Handle server error
            setSubmitError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-center">Create Account</h2>
                    {submitError && (
                        <p className="text-red-500 text-sm text-center">{submitError}</p>
                    )}

                    {/* Render all form fields dynamically */}
                    {["username", "password", "email", "phone", "dob"].map((field) => (
                        <div key={field}>
                            <input
                                type={
                                    field === "password"
                                        ? "password"
                                        : field === "dob"
                                            ? "date"
                                            : field === "email"
                                                ? "email"
                                                : "text"
                                }
                                name={field}
                                placeholder={
                                    field === "dob"
                                        ? "Date of Birth"
                                        : field.charAt(0).toUpperCase() + field.slice(1)
                                }
                                value={form[field]}
                                onChange={handleChange}
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                                    errors[field]
                                        ? "border-red-500 focus:ring-red-400"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />
                            {errors[field] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                            )}
                        </div>
                    ))}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold"
                    >
                        Register
                    </button>

                    {/* Link to Login Page */}
                    <p className="text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/" className="text-blue-600 hover:underline">
                            Cancel
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
