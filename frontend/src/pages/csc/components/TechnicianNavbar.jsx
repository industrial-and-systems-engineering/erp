import React from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, Links } from 'react-router-dom'

const TechnicianNavbar = ({ setFormData, setIsAuthenticated }) => {

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/technician/logout");
      if (response.ok) {
        setIsAuthenticated(false);
        setFormData({ username: "", email: "", password: "" });
        navigate("/technician");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  return (

    <header className="absolute inset-x-0 top-0 z-50 bg-blue-500 text-white">
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <img
            alt=""
            src="https://anab.ansi.org/wp-content/uploads/2022/10/ANAB-logo.png"
            className="h-10 w-auto"
          />
          <Link to="homepage"></Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            ) : (
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className={`lg:hidden ${mobileMenuOpen ? 'absolute inset-x-0 top-0 mt-16 p-6 bg-white' : 'hidden'}`}>
          <div className="flex flex-col items-center space-y-4">
            <Link to="homepage" onClick={() => setMobileMenuOpen(false)} className='text-sm font-semibold text-gray-900'>Homepage</Link>
            <Link to="pending" onClick={() => setMobileMenuOpen(false)} className='text-sm font-semibold text-gray-900'>Pending</Link>
            <Link to="completed" onClick={() => setMobileMenuOpen(false)} className='text-sm font-semibold text-gray-900'>Completed</Link>
            <Link
              onClick={handleLogout}
              className="text-sm font-semibold text-gray-900 p-2"
            >
              Log out
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          <Link to="homepage" className='text-sm font-semibold '>Homepage</Link>
          <Link to="pending" className='text-sm font-semibold '>Pending</Link>
          <Link to="completed" className='text-sm font-semibold '>Completed</Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link to="#"
            onClick={handleLogout}
            className="text-sm font-semibold  p-2"
          >
            Log out
          </Link>
        </div>
      </nav>
    </header>

  );
}

export default TechnicianNavbar
