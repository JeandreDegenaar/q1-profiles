// App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

/**
 * Main application component.
 * Sets up routing and protects the profile route.
 *
 * @returns {JSX.Element} The routed React application.
 */
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    // Update login state on storage changes (e.g., login or logout)
    useEffect(() => {
        const updateLoginStatus = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", updateLoginStatus);

        return () => {
            window.removeEventListener("storage", updateLoginStatus);
        };
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* Default route shows login page */}
                <Route path="/" element={<Login />} />

                {/* Route to signup page */}
                <Route path="/signup" element={<Signup />} />

                {/* Protected profile route, redirect to login if not authenticated */}
                <Route
                    path="/profile"
                    element={isLoggedIn ? <Profile /> : <Navigate to="/" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
