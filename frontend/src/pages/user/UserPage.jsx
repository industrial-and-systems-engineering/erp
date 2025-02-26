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
    <>
      <UserNavbar setFormData={setFormData} />
      <div className="relative isolate px-6 pt-14 lg:px-8 min-h-screen">
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
                <p className="text-black">Don't have an account?</p>
                <Link to="/signup" className="hover:text-blue-500">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
      <footer class="bg-gray-800 text-white">
        <div class="max-w-7xl mx-auto px-4 py-8">

          <div class="grid grid-cols-1 md:grid-cols-5 gap-8">


            <div>

              <img
                src="https://via.placeholder.com/150x50?text=ANAB+Logo"
                alt="ANAB Logo"
                class="mb-4"
              />
              <p class="text-sm leading-relaxed">
                The ANSI National Accreditation Board (ANAB) is a wholly owned subsidiary
                of the American National Standards Institute (ANSI), a non-profit organization.
              </p>
            </div>


            <div>
              <h2 class="text-lg font-semibold mb-4">USEFUL LINKS</h2>
              <ul class="space-y-2">
                <li><a href="#" class="hover:underline">FAQ</a></li>
                <li><a href="#" class="hover:underline">News</a></li>
                <li><a href="#" class="hover:underline">Careers</a></li>
                <li><a href="#" class="hover:underline">Mission</a></li>
                <li><a href="#" class="hover:underline">Leadership Team</a></li>
              </ul>
            </div>


            <div>
              <h2 class="text-lg font-semibold mb-4">LOGINS</h2>
              <ul class="space-y-2">
                <li><a href="#" class="hover:underline">EQM – Management Systems</a></li>
                <li><a href="#" class="hover:underline">EQCA – Lab Related</a></li>
                <li><a href="#" class="hover:underline">ANSICA</a></li>
                <li><a href="#" class="hover:underline">Assessors</a></li>
                <li><a href="#" class="hover:underline">My Shopping Account</a></li>

              </ul>
            </div>


            <div>
              <h2 class="text-lg font-semibold mb-4">CONTACT</h2>
              <p className="text-sm leading-relaxed mb-2">
                1891 Street NW<br />
                Suite 100A<br />
                Washington, DC 20036
              </p>
              <p className="text-sm mb-2">414-501-5494</p>
              <p className="text-sm">
                <a href="mailto:anab@anab.org" className="hover:underline">anab@anab.org</a>
              </p>
            </div>


            <div>
              <h2 class="text-lg font-semibold mb-4">Subscribe to ANAB Newsletter</h2>
              <form class="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  class="p-2 text-gray-800"
                  required
                />
                <button
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                >
                  Sign Up
                </button>
              </form>
              <p class="text-xs mt-2">
                By clicking sign up, you agree to our
                <a href="#" class="underline">Privacy Policy</a>
                and
                <a href="#" class="underline">Terms of Use</a>.
              </p>
            </div>
          </div>


          <div class="mt-8 border-t border-gray-700 pt-4 text-center md:text-left">
            <p class="text-sm text-gray-400">&copy; 2023 ANAB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default UserPage;
