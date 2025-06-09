/**
 * Profile.jsx
 * -----------
 * This component displays the user's profile and allows them to update
 * their username, email, phone, and date of birth.
 * It fetches user data on load and updates the backend on submit.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Main Profile component
export default function Profile() {
    // Form state for user profile inputs
    const [form, setForm] = useState({
        username: "",
        email: "",
        phone: "",
        dob: ""
    });

    // Stores original username separately for welcome message
    const [savedUsername, setSavedUsername] = useState("");

    // Feedback messages
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    /**
     * Fetch profile data from backend on mount
     * If no valid token, redirect to login page
     */
    const fetchProfile = async () => {
        try {
            const res = await axios.get("https://q1-profiles.onrender.com/api/profile", {
                headers: { Authorization: localStorage.getItem("token") },
            });

            const user = res.data;

            // Populate form fields with fetched data (use fallback values if empty)
            setForm({
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                dob: user.dob ? user.dob.substring(0, 10) : "", // Format YYYY-MM-DD for input[type=date]
            });

            setSavedUsername(user.username || "");
        } catch {
            // Redirect to login if profile fetch fails (e.g. token is invalid)
            navigate("/");
        }
    };

    // useEffect ensures profile fetch only runs once when component mounts
    useEffect(() => {
        fetchProfile();
    }, [navigate]);

    /**
     * Updates form state when input fields change
     */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    /**
     * Handles submission of updated profile
     * Validates client-side, then sends PUT request to backend
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple form validation rules
        if (!form.username.trim()) {
            return setError("Username cannot be empty");
        }

        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            return setError("Invalid email format");
        }

        if (!/^\d+$/.test(form.phone)) {
            return setError("Phone must be numeric");
        }

        try {
            // Send updated profile data to backend
            await axios.put("http://localhost:5000/api/profile", form, {
                headers: { Authorization: localStorage.getItem("token") },
            });

            setSavedUsername(form.username); // Update welcome message
            setSuccess("Profile updated successfully");
            setError(""); // Clear error if previously set
        } catch (err) {
            console.error(err);
            setError("Failed to update profile");
            setSuccess("");
        }
    };

    /**
     * Logs out the user by removing token and redirecting to login
     */
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // Render form
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                {/* Welcome message */}
                <h2 className="text-2xl font-bold text-center mb-4">
                    Welcome, {savedUsername || "User"}
                </h2>

                {/* Feedback messages */}
                {success && <p className="text-green-600 text-sm text-center">{success}</p>}
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                {/* Profile form */}
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                    <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold"
                    >
                        Save Changes
                    </button>
                </form>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="mt-4 w-full text-sm text-gray-500 hover:text-red-600 underline"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
