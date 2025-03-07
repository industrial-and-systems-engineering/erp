import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CSCloginpage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        usertype: "customerservicecell"
    });

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/csc/homepage");
            } else {
                setErrorMessage(data.message || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
                    Customer Service Login
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

                {/* Signup Link */}
                <div className="mt-4 text-center">
                    <p className="text-gray-600">Don't have an account?</p>
                    <button
                        onClick={() => navigate("/csc/signup")}
                        className="text-blue-500 hover:underline mt-1"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CSCloginpage;
