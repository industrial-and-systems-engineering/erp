import React from 'react'
import { useState } from 'react'
import { Button, Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
const navigation = [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
]

export default function LoginpageNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="absolute inset-x-0 top-0 z-50 bg-blue-500 text-white">
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                {/* Logo */}
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
                        {navigation.map((item) => (
                            <a key={item.name} href={item.href} className="text-sm/6 font-semibold">
                                {item.name}
                            </a>
                        ))}
                        <Link to="/user" className="text-sm/6 font-semibold">User Log in</Link>
                        <Link to="/technician" className="text-sm/6 font-semibold">Technician Log in</Link>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} className="text-sm/6 font-semibold">
                            {item.name}
                        </a>
                    ))}
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Link to="/user" className="text-sm font-bold p-2">User Log in</Link>
                    <Link to="/technician" className="text-sm font-bold p-2">Technician Log in</Link>

                </div>
            </nav>
        </header>

    )
}