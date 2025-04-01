import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import TechnicianNavbar from "./components/TechnicianNavbar";
import Footer from "../../components/Footer";
import { useAuthStore } from "../../utils/isloggedin.js";

const TechPage = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    usertype: "Technician",
  });
  const { isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    verifyAuth();
  }, [checkAuth]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        await checkAuth();
        navigate("/technician/homepage", { state: { usernumber: data.usernumber } });
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <div className='relative isolate px-6 pt-14 lg:px-8 min-h-screen'>
        {isAuthenticated ? (
          <div>
            <TechnicianNavbar setFormData={setFormData} />
            <Outlet />
          </div>
        ) : (
          <div className='flex justify-center items-center my-30'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-1/4 text-center'>
              <h1 className='text-xl mb-4'>Technician Login</h1>
              <form
                className='flex flex-col space-y-4'
                onSubmit={handleSubmit}
              >
                <label className='text-left'>
                  Username:
                  <input
                    type='text'
                    name='username'
                    placeholder='Enter your username'
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className='w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-400'
                  />
                </label>
                <label className='text-left'>
                  Email:
                  <input
                    type='email'
                    name='email'
                    placeholder='Enter your email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-400'
                  />
                </label>
                <label className='text-left'>
                  Password:
                  <input
                    type='password'
                    name='password'
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className='w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-400'
                  />
                </label>
                <button
                  type='submit'
                  className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300'
                >
                  Login
                </button>
              </form>
              <div className='mt-4'>
                <p className='text-black'>Don't have an account?</p>
                <Link
                  to='/technician/signup'
                  className='hover:text-blue-500'
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TechPage;
