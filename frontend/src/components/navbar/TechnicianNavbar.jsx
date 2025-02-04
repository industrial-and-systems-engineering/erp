import React from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { Button } from '@headlessui/react'
const navigation = [
  { name: 'Pending', href: '#' },
  { name: 'Completed', href: '#' },
]

const TechnicianNavbar =  ({ setFormData, setIsAuthenticated }) => {

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
  
  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>


          <div className="hidden lg:flex lg:gap-x-12">
            <Button as={Link} to="pending" className='text-sm/6 font-semibold text-gray-900'>Pending</Button>
            <Button as={Link} to="completed" className='text-sm/6 font-semibold text-gray-900'>Completed</Button>
          </div>


          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Button 
              as={Link} 
              to="/technician" 
              onClick={handleLogout} 
              className="text-sm/6 font-semibold text-gray-900 p-2"
            >
              Log out
            </Button>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default TechnicianNavbar
