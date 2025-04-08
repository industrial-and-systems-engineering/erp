import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Tsignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    usertype: "Technician",
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
        navigate("/technician/homepage");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred while registering.");
    }
  };

  return (
    <section className='bg-gradient-to-r from-pink-300 to-pink-200'>
      <div className='lg:grid lg:min-h-screen lg:grid-cols-12'>
        <section className='relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6'>
          <img
            alt='Registration background'
            src='https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
            className='absolute inset-0 h-full w-full object-cover opacity-80'
          />

          <div className='hidden lg:relative lg:block lg:p-12'>
            <h2 className='mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl'>
              Create Your Technician Account
            </h2>

            <p className='mt-4 leading-relaxed text-white/90'>
              Join our team of skilled technicians and start your journey with us.
            </p>
          </div>
        </section>

        <main className='flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6'>
          <div className='max-w-xl lg:max-w-3xl'>
            <div className='relative -mt-16 block lg:hidden'>
              <h1 className='mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl'>
                Create Your Technician Account
              </h1>

              <p className='mt-4 leading-relaxed text-gray-500'>
                Join our team of skilled technicians and start your journey with us.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className='mt-8 grid grid-cols-6 gap-6'
            >
              <div className='col-span-6'>
                <label
                  htmlFor='username'
                  className='block text-sm font-medium text-gray-700'
                >
                  Username
                </label>

                <input
                  type='text'
                  id='username'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className='mt-1 p-4 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:border-pink-400 focus:ring focus:ring-pink-200'
                />
              </div>

              <div className='col-span-6'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email
                </label>

                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='mt-1 p-4 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:border-pink-400 focus:ring focus:ring-pink-200'
                />
              </div>

              <div className='col-span-6'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>

                <input
                  type='password'
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className='mt-1 p-4 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:border-pink-400 focus:ring focus:ring-pink-200'
                />
              </div>

              <div className='col-span-6 sm:flex sm:items-center sm:gap-4'>
                <button
                  type='submit'
                  className='inline-block shrink-0 rounded-md border border-pink-600 bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-pink-600 focus:outline-none focus:ring active:text-pink-500'
                >
                  Create an account
                </button>

                <p className='mt-4 text-sm text-gray-500 sm:mt-0'>
                  Already have an account?
                  <Link
                    to='/technician'
                    className='text-gray-700 underline'
                  >
                    {" "}
                    Log in
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}

export default Tsignup;
