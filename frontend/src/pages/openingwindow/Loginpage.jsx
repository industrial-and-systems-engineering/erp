import React from "react";
import { motion } from "framer-motion";
import { StarIcon, CheckCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Loginpage = () => {
  // State for video display
  const [showVideo, setShowVideo] = React.useState(false);
  
  // Services offered
  const services = [
    {
      title: "Electrical Calibration",
      description:
        "Includes testing instruments like MultiMate's, oscilloscopes, and power analyser's.",
      image: "https://images.unsplash.com/photo-1627704671340-0969d7dbac25",
    },
    {
      title: "Mechanical Calibration",
      description:
        "Ensures precision in tools such as micrometre's, pressure gauges, and torque wrenches.",
      image: "https://images.unsplash.com/photo-1627704671340-0969d7dbac25",
    },
    {
      title: "Thermal Calibration",
      description: "Verifies the accuracy of temperature sensors, thermometers, and ovens.",
      image: "https://images.unsplash.com/photo-1627704671340-0969d7dbac25",
    },
    {
      title: "Mass Calibration",
      description: "Tests and calibrates weighing scales and balances to maintain accuracy.",
      image: "https://images.unsplash.com/photo-1627704671340-0969d7dbac25",
    },
    {
      title: "On-Site Calibration",
      description:
        "Offers the convenience of calibration services at the client's premises, minimizing downtime.",
      image: "https://images.unsplash.com/photo-1627704671340-0969d7dbac25",
    },
  ];

  // Industries served
  const industries = [
    "Pharmaceuticals",
    "Automobile Manufacturing",
    "Power and Energy",
    "Research and Development",
  ];

  // Advantages
  const advantages = [
    {
      title: "Accuracy",
      description:
        "With state-of-the-art equipment and skilled professionals, the lab guarantees high precision.",
    },
    {
      title: "Reliability",
      description: "NABL accreditation ensures compliance with international standards.",
    },
    {
      title: "Quick Turnaround",
      description: "Efficient processes and on-site services reduce operational delays.",
    },
    {
      title: "Comprehensive Support",
      description:
        "The lab provides calibration certificates, traceability reports, and expert guidance.",
    },
  ];

  // Animation variants for fade-in
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <>
      <div className='relative isolate pt-14'>
        {/* Hero Section */}
        <motion.section
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          className='relative w-full h-[500px] object-cover bg-center bg-cover flex items-center justify-center'
        >
          <img
            src='https://images.unsplash.com/photo-1582551716463-c0ba72d6e1d0?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='Precision Calibration Equipment'
            className='absolute inset-0 w-full h-full object-cover blur-xs'
          />
          <div className='absolute inset-0 bg-black opacity-50' />
          <div className='relative text-center text-white px-4 max-w-4xl'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Error Detector: A NABL-Certified Calibration Lab
            </h1>
            <p className='text-xl md:text-2xl mb-8'>
              Ensuring Precision and Trust in Every Measurement
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <Link
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors'
                to='/user'
              >
                Get Started
              </Link>
              <Link
                to='/services'
                className='bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors'
              >
                Explore Services
              </Link>
            </div>
          </div>
        </motion.section>
        {/* About Section */}
        <motion.section
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          className='py-16 bg-white'
        >
          <div className='container mx-auto px-4'>
            <div className='flex flex-col md:flex-row items-center gap-8'>
              <div className='md:w-1/2'>
                <img
                  src='https://images.unsplash.com/photo-1602052577122-f73b9710adba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  alt='Calibration Laboratory'
                  className='rounded-lg shadow-lg w-full h-auto'
                />
              </div>
              <div className='md:w-1/2'>
                <h2 className='text-3xl font-bold mb-4'>About Error Detector</h2>
                <p className='text-gray-700 mb-4'>
                  Error Detector is an ISO/IEC 17025-accredited calibration laboratory under the
                  National Accreditation Board for Testing and Calibration Laboratories (NABL). With
                  a commitment to excellence, the lab offers services to industries such as Testing
                  and Calibration facilities.
                </p>
                <p className='text-gray-700 mb-4'>
                  The NABL certification ensures that every calibration process adheres to stringent
                  international standards, giving client's confidence in the precision and
                  reliability of their equipment.
                </p>
                <p className='text-gray-700'>
                  In the world of engineering, precision is paramount. Whether it's measuring
                  voltage, resistance, or mechanical stress, accuracy can make or break an
                  operation. This is where NABL-certified calibration labs, like Error Detector,
                  come into play.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
        {/* Why Calibration is Crucial */}
        <motion.section
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          className='py-16 bg-gray-100'
        >
          <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold text-center mb-8'>Why Calibration is Crucial</h2>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <p className='text-gray-700 mb-4'>
                Calibration is the process of verifying and adjusting the accuracy of measuring
                instruments. Over time, even the most advanced equipment may lose precision due to
                wear and tear or environmental factors. This can lead to incorrect readings,
                compromising the quality of products and processes.
              </p>
              <p className='text-gray-700'>
                Error Detector ensures that all instruments are calibrated to deliver accurate
                results, reducing errors and enhancing operational efficiency.
              </p>
            </div>
          </div>
        </motion.section>
        {/* Services Section */}
        <motion.section
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          className='py-16 bg-white'
        >
          <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold text-center mb-8'>Our Calibration Services</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className='bg-gray-100 shadow-md rounded-lg overflow-hidden flex flex-col'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className='p-4 flex-grow'>
                    <h3 className='text-xl font-bold mb-2'>{service.title}</h3>
                    <p className='text-gray-600'>{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        {/* Advantages Section */}
        <motion.section
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          className='py-16 bg-gray-100'
        >
          <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold text-center mb-8'>
              Advantages of Choosing Error Detector
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  className='bg-white p-6 rounded-lg shadow-md text-center'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <CheckCircleIcon className='h-12 w-12 text-green-500 mx-auto mb-4' />
                  <h3 className='text-xl font-bold mb-2'>{advantage.title}</h3>
                  <p className='text-gray-600'>{advantage.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        {/* Industries Section */}
        <motion.section
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          className='py-16 bg-white'
        >
          <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold text-center mb-8'>Industries We Serve</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  className='bg-gray-100 p-4 rounded-lg shadow-md text-center'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className='font-semibold'>{industry}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        {/* YouTube Demo Section */}
        <motion.section
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          className='py-16 bg-gray-800 text-white'
        >
          <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold text-center mb-4'>See Our System in Action</h2>
            <p className='text-center mb-8 max-w-2xl mx-auto'>
              Watch this demo to understand how our calibration management system works and how it can streamline your operations.
            </p>
            <div className="relative aspect-video max-w-3xl mx-auto">
              {showVideo ? (
                <iframe
                  className="w-full h-full border-0"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Error Detector Calibration System Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <button
                    onClick={() => setShowVideo(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 cursor-pointer"
                  >                     
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Play Demo Video
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.section>
        {/* Conclusion Section */}
        <motion.section
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          className='py-16 bg-gray-100'
        >
          <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold text-center mb-8'>Our Commitment to Excellence</h2>
            <div className='bg-white p-6 rounded-lg shadow-md text-center'>
              <p className='text-gray-700 mb-4'>
                Error Detector is not just a calibration lab; it is a partner in maintaining
                accuracy, trust, and excellence. By choosing a NABL-certified lab like Error
                Detector, businesses can ensure their instruments are reliable and compliant with
                the highest standards.
              </p>
              <p className='text-gray-700 font-bold'>
                Precision matters, and with Error Detector, it's a guarantee.
              </p>
              <div className='mt-8'></div>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default Loginpage;
