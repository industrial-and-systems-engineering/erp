import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AboutUs = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <motion.div
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='text-white py-24 px-4 text-center bg-blue-900'
      >
        <h1 className='text-3xl md:text-4xl font-bold mb-4'>Precision is Our Promise</h1>
        <p className='text-lg max-w-2xl mx-auto'>
          Error Detector - Your NABL-accredited partner in maintaining measurement accuracy.
        </p>
      </motion.div>

      {/* Our Story */}
      <motion.section
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='py-12 px-4 max-w-6xl mx-auto'
      >
        <div className='grid md:grid-cols-2 gap-8 items-center'>
          <div>
            <h2 className='text-2xl font-bold mb-4'>Our Commitment to Precision</h2>
            <p className='text-gray-600 mb-3'>
              Error Detector was founded with a vision to become the gold standard in calibration
              services. As an ISO/IEC 17025-accredited laboratory under NABL, we adhere to the most
              stringent international standards in every calibration process.
            </p>
          </div>
          <div className='rounded-lg overflow-hidden shadow-lg'>
            <img
              src='https://images.unsplash.com/photo-1719210722633-2756cda18bcf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              alt='Precision calibration equipment'
              className='w-full h-auto'
            />
          </div>
        </div>
      </motion.section>

      {/* Our Services */}
      <motion.section
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='py-12 px-4 bg-gray-50'
      >
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-2xl font-bold mb-8 text-center'>
            Comprehensive Calibration Services
          </h2>
          <div className='grid md:grid-cols-3 gap-6'>
            {[
              "Electrical Calibration",
              "Mechanical Calibration",
              "Thermal Calibration",
              "Mass Calibration",
              "On-Site Calibration",
            ].map((service, index) => (
              <div
                key={index}
                className='bg-white p-6 rounded-lg shadow-md'
              >
                <h3 className='text-lg font-semibold mb-2'>{service}</h3>
                <p className='text-gray-600 text-sm'>
                  Precision testing and calibration services for various industries.
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='py-12 px-4 max-w-6xl mx-auto'
      >
        <h2 className='text-2xl font-bold mb-8 text-center'>Why Error Detector?</h2>
        <div className='grid md:grid-cols-2 gap-8'>
          <div>
            <ul className='space-y-4'>
              <li>NABL Accreditation</li>
              <li>Expert Team</li>
              <li>Comprehensive Documentation</li>
              <li>Quick Turnaround</li>
            </ul>
          </div>
          <div className='rounded-lg overflow-hidden shadow-lg'>
            <img
              src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
              alt='Advanced calibration laboratory'
              className='w-full h-auto'
            />
          </div>
        </div>
      </motion.section>

      {/* Industries We Serve */}
      <motion.section
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='py-12 px-4 bg-gray-50'
      >
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-2xl font-bold mb-8 text-center'>Industries We Serve</h2>
          <div className='grid md:grid-cols-4 gap-4'>
            {["Pharmaceuticals", "Manufacturing", "Power & Energy", "Research & Development"].map(
              (industry, index) => (
                <div
                  key={index}
                  className='bg-white p-4 rounded-lg shadow-md text-center'
                >
                  <h3 className='text-base font-semibold mb-1'>{industry}</h3>
                  <p className='text-gray-600 text-sm'>Ensuring precision and compliance.</p>
                </div>
              )
            )}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='py-12 px-4 text-center bg-blue-900 text-white'
      >
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-2xl font-bold mb-4'>Ready to Ensure Precision in Your Operations?</h2>
          <div className='flex justify-center gap-3'>
            <Link
              to='/services'
              className='px-6 py-2 bg-transparent border border-white text-white font-medium rounded-md hover:bg-blue-800 transition-colors text-sm'
            >
              Explore Services
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;
