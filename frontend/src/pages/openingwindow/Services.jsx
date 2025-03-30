import React from "react";
import { motion } from "framer-motion";

const Services = () => {
  const services = [
    {
      title: "Laboratory Calibration",
      description: "Precise calibration of instruments in our state-of-the-art facility",
      icon: "🔬",
    },
    {
      title: "On-Site Calibration",
      description: "Calibration services at your location to minimize downtime",
      icon: "🏭",
    },
    {
      title: "Equipment Repair",
      description: "Expert repair and maintenance of calibration instruments",
      icon: "🔧",
    },
    {
      title: "Calibration Training",
      description: "Comprehensive training programs for your technical staff",
      icon: "📚",
    },
  ];

  return (
    <div className='bg-gradient-to-b from-blue-100 to-purple-100 min-h-screen py-20  px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <motion.h2
          className='text-4xl font-extrabold text-center text-gray-900 mb-12'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Calibration Services
        </motion.h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {services.map((service, index) => (
            <motion.div
              key={index}
              className='bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out'
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className='text-4xl mb-4'>{service.icon}</div>
              <h3 className='text-xl font-semibold mb-2'>{service.title}</h3>
              <p className='text-gray-600'>{service.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          className='mt-16 text-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className='text-xl text-gray-700 italic'>
            "Precision is not just a goal, it's our standard."
          </p>
          <p className='mt-2 text-gray-500'>- Our Commitment to Excellence</p>
        </motion.div>
        <motion.div
          className='mt-12 bg-white rounded-lg shadow-lg p-6'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className='text-2xl font-semibold mb-4'>Why Choose Our Calibration Services?</h3>
          <ul className='list-disc pl-6 space-y-2'>
            <li>ISO/IEC 17025:2017 accredited laboratory</li>
            <li>Comprehensive range of calibration services for various industries</li>
            <li>Quick turnaround times to minimize equipment downtime</li>
            <li>Experienced technicians with extensive knowledge in calibration procedures</li>
            <li>Customized calibration solutions to meet your specific needs</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
