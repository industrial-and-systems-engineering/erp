import React, { useState, useEffect } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  DocumentPlusIcon,
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../utils/isloggedin.js";
import logoSvg from "../../../assets/logofull.svg";
const UserNavbar = ({ setFormData }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/user/logout", { method: "GET" });
      checkAuth(false);
      setFormData({ username: "", email: "", password: "", usertype: "customer" });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Navigation items
  const navItems = [
    { name: "Home", path: "/user", icon: HomeIcon },
    { name: "Completed Products", path: "/user/completed", icon: CheckCircleIcon },
    { name: "Pending Form", path: "/user/pending", icon: ClipboardDocumentListIcon },
    { name: "Create Form", path: "/user/create", icon: DocumentPlusIcon },
  ];

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md text-blue-600" : "bg-blue-600 text-white"
      }`}
    >
      <nav
        aria-label='Global'
        className='flex items-center justify-between p-4 lg:px-8'
      >
        {/* Logo */}
        <div className='flex items-center lg:flex-1'>
          <Link
            to='/'
            className='flex items-center gap-2'
          >
            <img
              alt='Company Logo'
              src={logoSvg}
              className='h-10 w-auto'
            />
            <span
              className={`hidden md:block font-bold text-lg transition-colors ${
                scrolled ? "text-blue-600" : "text-white"
              }`}
            >
              User Portal
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className='flex lg:hidden'>
          <button
            type='button'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`inline-flex items-center justify-center rounded-md p-2 ${
              scrolled ? "text-blue-600 hover:bg-blue-100" : "text-white hover:bg-blue-700"
            }`}
          >
            <span className='sr-only'>Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon
                className='h-6 w-6'
                aria-hidden='true'
              />
            ) : (
              <Bars3Icon
                className='h-6 w-6'
                aria-hidden='true'
              />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className='hidden lg:flex lg:gap-x-8'>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive(item.path)
                  ? scrolled
                    ? "bg-blue-100 text-blue-700"
                    : "bg-blue-700 text-white"
                  : scrolled
                  ? "text-blue-600 hover:bg-blue-50"
                  : "text-white hover:bg-blue-700"
              }`}
            >
              <item.icon className='h-5 w-5' />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop sign out button */}
        <div className='hidden lg:flex lg:flex-1 lg:justify-end'>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                scrolled
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              <ArrowRightOnRectangleIcon className='h-5 w-5' />
              Sign Out
            </button>
          )}
        </div>
      </nav>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className='lg:hidden absolute inset-x-0 top-16 bg-white shadow-lg rounded-b-lg overflow-hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1'>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className='h-5 w-5' />
                {item.name}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className='w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50'
              >
                <ArrowRightOnRectangleIcon className='h-5 w-5' />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
