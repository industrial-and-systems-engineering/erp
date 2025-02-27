import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../utils/isloggedin.js';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const UserNavbar = ({ setFormData }) => {
    const { isAuthenticated, checkAuth } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleLogout = async () => {
        try {
            await fetch("/api/user/logout", { method: "GET" });
            checkAuth(false);


            setFormData({ username: "", email: "", password: "" });

            navigate("/user"); // Redirect to home after logout
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    return (

        <header className="absolute inset-x-0 top-0 z-50 bg-blue-500 text-white">
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-2 p-2">
                        <span className="sr-only">Your Company</span>
                        <img
                            alt=""
                            src="https://anab.ansi.org/wp-content/uploads/2022/10/ANAB-logo.png"
                            className="h-10 w-auto"
                        />
                    </a>
                </div>
                {/* Mobile Menu */}
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
                        <Link to="/user" className="text-sm/6 font-semibold text-gray-900" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link to="/user/completed" className="text-sm/6 font-semibold text-gray-900" onClick={() => setMobileMenuOpen(false)}>Completed Products</Link>
                        <Link to="/user/pending" className="text-sm/6 font-semibold text-gray-900" onClick={() => setMobileMenuOpen(false)}>Pending Form</Link>
                        <Link to="/user/create" className="text-sm/6 font-semibold text-gray-900" onClick={() => setMobileMenuOpen(false)}>Create Form</Link>
                        <Link
                            to="#"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="text-sm/6 font-semibold text-gray-900 p-2"
                        >
                            Sign Out
                        </Link>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex lg:gap-x-12">
                    <Link to="/user" className="text-sm/6 font-semibold ">Home</Link>
                    <Link to="/user/completed" className="text-sm/6 font-semibold ">Completed Products</Link>
                    <Link to="/user/pending" className="text-sm/6 font-semibold ">Pending Form</Link>
                    <Link to="/user/create" className="text-sm/6 font-semibold ">Create Form</Link>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {isAuthenticated && (
                        <Link
                            to="#"
                            onClick={handleLogout}
                            className="text-sm/6 font-semibold  p-2"
                        >
                            Sign Out
                        </Link>
                    )}
                </div>
            </nav>
        </header>

    );
};

export default UserNavbar;
