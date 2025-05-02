import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CSCsignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    usertype: "customerservicecell",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/csc/homepage");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred while registering.");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-pink-300 to-pink-200 flex flex-col">
      <div className="flex-grow flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-5">
            Create an Account
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-left text-gray-600 text-sm">
              Username:
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full p-2 mt-1 border border-gray-300 rounded focus:border-pink-400 focus:ring focus:ring-pink-200"
              />
            </label>
            <label className="block text-left text-gray-600 text-sm">
              Email:
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 mt-1 border border-gray-300 rounded focus:border-pink-400 focus:ring focus:ring-pink-200"
              />
            </label>
            <label className="block text-left text-gray-600 text-sm">
              Password:
              <input
                type="password"
                name="password"
                placeholder="Choose a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 mt-1 border border-gray-300 rounded focus:border-pink-400 focus:ring focus:ring-pink-200"
              />
            </label>
            <button
              type="submit"
              className="w-full p-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition duration-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CSCsignup;
