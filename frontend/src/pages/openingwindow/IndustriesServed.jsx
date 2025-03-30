import React from "react";
import { motion } from "framer-motion";

const IndustriesServed = () => {
  const industries = [
    {
      name: "Manufacturing",
      description:
        "Ensures product quality, optimizes processes, and maintains regulatory compliance in various manufacturing sectors.",
      image: "https://picsum.photos/id/1018/1000/600/",
    },
    {
      name: "Healthcare",
      description:
        "Guarantees accuracy in medical devices for correct diagnoses and treatments, improving patient safety.",
      image: "https://picsum.photos/id/1015/1000/600/",
    },
    {
      name: "Aerospace & Defense",
      description:
        "Maintains precision in critical equipment for safety and performance in aircraft and defense systems.",
      image: "https://picsum.photos/id/1019/1000/600/",
    },
    {
      name: "Electronics",
      description:
        "Supports quality control and innovation in electronics manufacturing, from consumer devices to industrial equipment.",
      image: "https://picsum.photos/id/1020/1000/600/",
    },
    {
      name: "Automotive",
      description:
        "Ensures accuracy in testing and measurement equipment for vehicle safety and performance.",
      image: "https://picsum.photos/id/1021/1000/600/",
    },
    {
      name: "Telecommunications",
      description:
        "Maintains precision in network equipment and testing instruments for reliable communication services.",
      image: "https://picsum.photos/id/1022/1000/600/",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, type: "spring", stiffness: 100 },
    },
    hover: {
      y: -10,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className='bg-gradient-to-b from-gray-50 to-gray-100 py-20'>
      <motion.div
        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className='text-4xl font-extrabold text-gray-900 mb-2 text-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Industries We Serve
        </motion.h2>
        <motion.p
          className='text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Our calibration services provide critical support across diverse sectors, ensuring
          precision and reliability where it matters most.
        </motion.p>

        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              className='bg-white rounded-xl overflow-hidden shadow-md'
              variants={itemVariants}
              whileHover='hover'
            >
              <div className='relative h-48 overflow-hidden'>
                <motion.img
                  src={industry.image}
                  alt={industry.name}
                  className='w-full h-full object-cover'
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end'>
                  <h3 className='text-2xl font-bold text-white p-4'>{industry.name}</h3>
                </div>
              </div>
              <div className='p-6'>
                <p className='text-gray-600'>{industry.description}</p>
                <motion.button
                  className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm'
                  whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IndustriesServed;
