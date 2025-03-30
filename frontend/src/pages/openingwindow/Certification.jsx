import React from "react";
import { motion } from "framer-motion";

const Certification = () => {
  const certifications = [
    {
      name: "ISO/IEC 17025",
      description:
        "The international standard specifying the general requirements for the competence, impartiality, and consistent operation of calibration laboratories.",
      benefits: [
        "Promotes confidence in calibration across industries",
        "Improves quality of calibration laboratories and data",
        "Provides global recognition and competitive advantage",
        "Ensures consistent operations and measurement accuracy",
      ],
      icon: "🌐",
    },
    {
      name: "NABL Accreditation",
      description:
        "Formal recognition by the National Accreditation Board for Testing and Calibration Laboratories, providing globally recognized certification for quality calibration services.",
      benefits: [
        "Unmatched precision and accuracy in measurements",
        "Regulatory compliance for industries requiring precise measurements",
        "Cost efficiency by reducing errors and potential losses",
        "Enhanced credibility with clients and partners",
      ],
      icon: "🏆",
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className='bg-gray-50 py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl'>
            Our Accreditations & Certifications
          </h2>
          <p className='mt-4 text-xl text-gray-600 max-w-3xl mx-auto'>
            We maintain the highest standards of quality and precision through internationally
            recognized accreditations.
          </p>
        </motion.div>

        <div className='mt-12 space-y-12'>
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className='bg-white overflow-hidden shadow rounded-lg'
              variants={fadeInUp}
              initial='initial'
              whileInView='animate'
              viewport={{ once: true }}
            >
              <div className='px-4 py-5 sm:p-6'>
                <div className='md:flex md:items-start'>
                  <div className='flex-shrink-0 bg-blue-100 rounded-md p-3 text-4xl'>
                    {cert.icon}
                  </div>
                  <div className='mt-4 md:mt-0 md:ml-6'>
                    <h3 className='text-2xl font-semibold text-gray-900'>{cert.name}</h3>
                    <p className='mt-2 text-base text-gray-600'>{cert.description}</p>

                    <div className='mt-4'>
                      <h4 className='text-lg font-medium text-gray-900'>Key Benefits:</h4>
                      <ul className='mt-2 space-y-2'>
                        {cert.benefits.map((benefit, i) => (
                          <li
                            key={i}
                            className='flex items-start'
                          >
                            <span className='flex-shrink-0 text-green-500 mr-2'>✓</span>
                            <span className='text-gray-600'>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className='mt-12 bg-blue-600 rounded-lg shadow-lg overflow-hidden'
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className='px-6 py-8 md:flex md:items-center md:justify-between'>
            <div className='text-white'>
              <h3 className='text-xl font-semibold'>Our Commitment to Excellence</h3>
              <p className='mt-2 text-blue-100'>
                Our laboratory is accredited according to ISO/IEC 17025:2017 and recognized by NABL,
                ensuring our calibration services meet international standards.
              </p>
            </div>
            <div className='mt-4 md:mt-0'>
              <motion.button
                className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Certificates
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className='mt-16 text-center'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className='text-base text-gray-500'>
            Our calibration laboratories are regularly assessed and maintain accreditation through
            March 2025.
          </p>
          <p className='mt-2 text-sm text-gray-400'>Last updated: March 2025</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Certification;
