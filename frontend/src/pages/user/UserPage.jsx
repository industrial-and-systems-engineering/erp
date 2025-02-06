import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import UserNavbar from "../../components/navbar/UserNavbar.jsx";
import { useAuthStore } from "../../utils/isloggedin.js";

const UserPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);

  const { isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    verifyAuth();
  }, [checkAuth]);

  useEffect(() => {

    if (!loading) {

      if (!isAuthenticated && location.pathname !== "/user/signup" && location.pathname !== "/user") {
        alert("You are not authenticated. Please log in.");
        navigate("/user");
      }
    }
  }, [isAuthenticated, loading, location.pathname, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.redirectUrl) {
        await checkAuth();
        navigate(data.redirectUrl);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <UserNavbar setFormData={setFormData} />
      {isAuthenticated ? (
        <Outlet />
      ) : (
        <div className="flex justify-center items-center my-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 text-center">
            <h1 className="text-xl mb-4">User Login</h1>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <label className="text-left">
                Username:
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-400"
                />
              </label>
              <label className="text-left">
                Email:
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-400"
                />
              </label>
              <label className="text-left">
                Password:
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-400"
                />
              </label>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>
            </form>
            <div className="mt-4">
              <p className="text-blace">Don't have an account?</p>
              <Link to="/user/signup" className="hover:text-blue-500">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
