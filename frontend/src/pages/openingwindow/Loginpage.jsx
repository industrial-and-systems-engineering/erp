import React from 'react'
import LoginpageNavbar from '../../components/navbar/LoginpageNavbar'
import Footer from '../../components/footer'

const Loginpage = () => {
  return (
    <>
      <LoginpageNavbar />
      <div className="relative isolate pt-14">
        {/* Hero Section */}
        <section
          className="relative w-full h-100 object-cover bg-center bg-cover flex items-center justify-center"
          style={{
            backgroundImage: "url('https://plus.unsplash.com/premium_photo-1681412205238-8171ccaca82b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black-10" />
          <h1 className="relative text-white text-3xl md:text-4xl font-bold uppercase">
            Accreditations
          </h1>
        </section>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:space-x-8">
            {/* Left Content */}
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Calibration Laboratory
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The ANAB calibration laboratory accreditation program is nationally
                and internationally recognized and enables calibration laboratories
                to demonstrate competency and promote confidence in calibration.
              </p>
            </div>

            {/* Right Image (Optional) */}
            <div className="md:w-1/2">
              {/* Replace with your own image */}
              <img
                src="https://images.unsplash.com/photo-1627704671340-0969d7dbac25?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Calibration Lab"
                className="w-full h-auto object-cover rounded shadow"
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Loginpage
