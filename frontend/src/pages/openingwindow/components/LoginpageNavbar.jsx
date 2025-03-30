import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  WrenchIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "About Us", href: "/about", icon: null },
  { name: "Services", href: "/services", icon: null },
  { name: "Industries Served", href: "/industries", icon: null },
  { name: "Certifications", href: "/certifications", icon: null },
  //   { name: "Resources/Blog", href: "/resources", icon: null },
  //   { name: "FAQs", href: "/faqs", icon: null },
  //   { name: "Contact Us", href: "/contact", icon: null },
];

const loginOptions = [
  { name: "User Log in", path: "/user", icon: UserIcon },
  { name: "Technician Log in", path: "/technician/homepage", icon: WrenchIcon },
  { name: "CSC Log in", path: "/csc", icon: BuildingOfficeIcon },
];

export default function LoginpageNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
          <a
            href='/'
            className='flex items-center gap-2'
          >
            <img
              alt='Company Logo'
              src='https://anab.ansi.org/wp-content/uploads/2022/10/ANAB-logo.png'
              className='h-10 w-auto'
            />
            {/* <span
              className={`hidden md:block font-bold text-lg transition-colors ${
                scrolled ? "text-blue-600" : "text-white"
              }`}
            >
              ANAB Portal
            </span> */}
          </a>
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
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                scrolled
                  ? "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  : "text-white hover:bg-blue-600"
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop login buttons */}
        <div className='hidden lg:flex lg:gap-x-4 lg:flex-1 lg:justify-end'>
          {loginOptions.map((option) => (
            <Link
              key={option.name}
              to={option.path}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive(option.path)
                  ? scrolled
                    ? "bg-blue-100 text-blue-700"
                    : "bg-blue-600 text-white"
                  : scrolled
                  ? "text-blue-600 hover:bg-blue-50"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <option.icon className='h-5 w-5' />
              {option.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className='lg:hidden absolute inset-x-0 top-16 bg-white shadow-lg rounded-b-lg overflow-hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1'>
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className='block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md'
              >
                {item.name}
              </a>
            ))}

            <div className='mt-4 pt-4 border-t border-gray-200'>
              <div className='space-y-2'>
                {loginOptions.map((option) => (
                  <Link
                    key={option.name}
                    to={option.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 text-base font-medium rounded-md ${
                      isActive(option.path)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <option.icon className='h-5 w-5' />
                    {option.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
