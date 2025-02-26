import React from 'react'
import LoginpageNavbar from '../../components/navbar/LoginpageNavbar'

const Loginpage = () => {
  return (
    <>
      <LoginpageNavbar />
      <div className="relative isolate px-6 pt-14 lg:px-8">
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

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Data to enrich your online business
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
              fugiat veniam occaecat.
            </p>

          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
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
  )
}

export default Loginpage
