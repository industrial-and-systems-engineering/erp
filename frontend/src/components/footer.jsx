import React from 'react'

const Footer = () => {
    return (
        <>
            <footer class="bg-gray-800 text-white">
                <div class="max-w-7xl mx-auto px-4 py-8">

                    <div class="grid grid-cols-1 md:grid-cols-5 gap-8">


                        <div>

                            <img
                                src="https://anab.ansi.org/wp-content/uploads/2022/10/ANAB-logo.png"
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
                                    class="p-2 text-white"
                                    required
                                />
                                <button
                                    type="submit"
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                                >
                                    Subscribe
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
    )
}

export default Footer
