import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TechnicianNavbar from "./components/TechnicianNavbar";
import Footer from "../../components/footer";

const TechPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();


    useEffect(() => {
        const checkAuth = async () => {
            // Update your useEffect checkAuth to:

            try {
                const response = await fetch('/api/technician/check-auth', {
                    credentials: 'include'
                });

                const data = await response.json();
                setIsAuthenticated(response.ok && data.authenticated);

            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await fetch("/api/technician/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setIsAuthenticated(true);
                navigate("/technician/homepage");
            } else {
                setErrorMessage(data.message || "Invalid credentials or login failed.");
            }
        } catch (error) {
            console.error("Technician login error:", error);
            setErrorMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            {/* Navbar */}
            {isAuthenticated && (
                <TechnicianNavbar
                    setFormData={setFormData}
                    setIsAuthenticated={setIsAuthenticated}
                />
            )}
            <div className="relative isolate px-6 pt-14 lg:px-8 min-h-screen">

                {/* Login Form or Nested Routes */}
                {isAuthenticated ? (
                    <Outlet /> // Render nested routes after authentication

                ) : (
                    <div className="flex flex-col items-center justify-center w-full my-20">
                        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
                                CSC Login
                            </h2>

                            {errorMessage && (
                                <p className="text-red-500 text-center">{errorMessage}</p>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}

export default TechPage

