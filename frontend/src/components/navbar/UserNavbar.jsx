import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../utils/isloggedin.js';

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

                    <div className="hidden lg:flex lg:gap-x-12">
                        <Link to="/user" className="text-sm/6 font-semibold text-gray-900">Home</Link>
                        <Link to="/user/completed" className="text-sm/6 font-semibold text-gray-900">Completed Products</Link>
                        <Link to="/user/pending" className="text-sm/6 font-semibold text-gray-900">Pending Form</Link>
                        <Link to="/user/create" className="text-sm/6 font-semibold text-gray-900">Create Form</Link>
                    </div>

                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        {isAuthenticated && (
                            <Link
                                to="#"
                                onClick={handleLogout}
                                className="text-sm/6 font-semibold text-gray-900 p-2"
                            >
                                Sign Out
                            </Link>
                        )}
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default UserNavbar;
