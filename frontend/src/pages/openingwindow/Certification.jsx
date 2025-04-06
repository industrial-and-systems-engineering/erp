import React, { useState } from "react";
import { motion } from "framer-motion";
import PDFModal from "./components/PDFModal";

const Certification = () => {
  const [showCertificatePDF, setShowCertificatePDF] = useState(false);
  const [showScopePDF, setShowScopePDF] = useState(false);

  const certificationDetails = {
    name: "ISO/IEC 17025:2017",
    certificateNumber: "CC-3731",
    issuedBy: "National Accreditation Board for Testing and Calibration Laboratories (NABL)",
    issueDate: "15/10/2023",
    validUntil: "14/10/2025",
    facility: "ERROR DETECTOR, 53/2, HARIDEVPUR ROAD, 24 PARGANAS (S), WEST BENGAL, INDIA",
    scope: [
      {
        category: "Electro-Technical Calibration",
        items: [
          "AC/DC Voltage & Current Measurement",
          "AC Power & Power Factor Calibration",
          "DC Resistance Measurement",
          "Capacitance & Inductance Calibration",
          "Temperature Simulation (RTD & Thermocouples)",
          "Time & Frequency Calibration",
        ],
      },
    ],
    benefits: [
      "Internationally recognized standard for laboratory competence",
      "Ensures precision and accuracy in all calibration services",
      "Demonstrates technical competence and reliability",
      "Provides confidence in measurement traceability",
    ],
  };

  const calibrationCapabilities = [
    {
      name: "Electrical Measurement",
      icon: "⚡",
      parameters: [
        "AC/DC Voltage (1mV to 1000V)",
        "AC/DC Current (10μA to 10A)",
        "High Voltage (up to 28kV)",
        "Resistance (0.001Ω to 1000MΩ)",
      ],
    },
    {
      name: "Temperature Calibration",
      icon: "🌡️",
      parameters: [
        "RTD (PT-100) from -200°C to 800°C",
        "Thermocouples (Types B, E, J, K, R, S, T, N)",
        "Temperature Controllers & Indicators",
        "Temperature range from -200°C to 1800°C",
      ],
    },
    {
      name: "Time & Frequency",
      icon: "⏱️",
      parameters: [
        "Frequency (10Hz to 1.2MHz)",
        "Time measurement (10s to 3600s)",
        "Precision timing devices",
      ],
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className='bg-gradient-to-b from-gray-50 to-blue-50 py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl'>
            Our Accreditations & Certifications
          </h2>
          <p className='mt-4 text-xl text-gray-600 max-w-3xl mx-auto'>
            Error Detector maintains the highest standards of quality and precision through
            internationally recognized accreditations.
          </p>
        </motion.div>

        <motion.div
          className='bg-white overflow-hidden shadow-lg rounded-lg border border-blue-100'
          variants={fadeInUp}
          initial='initial'
          whileInView='animate'
          viewport={{ once: true }}
        >
          <div className='px-4 py-5 sm:p-6'>
            <div className='md:flex md:items-start'>
              <div className='flex-shrink-0 bg-blue-100 rounded-md p-4 text-5xl'>🏆</div>
              <div className='mt-4 md:mt-0 md:ml-6 w-full'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='text-2xl font-semibold text-gray-900'>
                      {certificationDetails.name}
                    </h3>
                    <p className='mt-1 text-sm text-blue-600 font-medium'>
                      Certificate Number: {certificationDetails.certificateNumber}
                    </p>
                  </div>
                  <div className='bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full'>
                    Valid until {certificationDetails.validUntil}
                  </div>
                </div>

                <p className='mt-3 text-base text-gray-600'>
                  Accredited by the {certificationDetails.issuedBy} for "General Requirements for
                  the Competence of Testing & Calibration Laboratories"
                </p>

                <div className='mt-4 bg-gray-50 p-4 rounded-md'>
                  <h4 className='text-lg font-medium text-gray-900'>Accredited Facility:</h4>
                  <p className='mt-1 text-gray-600'>{certificationDetails.facility}</p>
                </div>

                <div className='mt-4'>
                  <h4 className='text-lg font-medium text-gray-900'>Key Benefits:</h4>
                  <ul className='mt-2 space-y-2'>
                    {certificationDetails.benefits.map((benefit, i) => (
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

                <div className='mt-6 flex flex-wrap gap-3'>
                  <motion.button
                    className='px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCertificatePDF(true)}
                  >
                    View Certificate
                  </motion.button>
                  <motion.button
                    className='px-4 py-2 cursor-pointer bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowScopePDF(true)}
                  >
                    View Scope of Accreditation
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className='mt-12'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className='text-2xl font-bold text-center text-gray-900 mb-8'>
            Our Calibration Capabilities
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {calibrationCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                className='bg-white rounded-lg shadow-md overflow-hidden border border-blue-100'
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className='bg-blue-600 text-white p-4'>
                  <div className='flex items-center'>
                    <span className='text-2xl mr-3'>{capability.icon}</span>
                    <h3 className='text-xl font-semibold'>{capability.name}</h3>
                  </div>
                </div>
                <div className='p-4'>
                  <ul className='space-y-2'>
                    {capability.parameters.map((param, idx) => (
                      <li
                        key={idx}
                        className='flex items-start'
                      >
                        <span className='flex-shrink-0 text-blue-500 mr-2'>•</span>
                        <span className='text-gray-700'>{param}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className='mt-12 bg-blue-600 rounded-lg shadow-lg overflow-hidden'
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className='px-6 py-8 md:flex md:items-center md:justify-between'>
            <div className='text-white'>
              <h3 className='text-xl font-semibold'>ISO/IEC 17025:2017 Accreditation</h3>
              <p className='mt-2 text-blue-100'>
                Our laboratory is accredited for over 100 specific calibration parameters across
                electrical, thermal, and time measurements.
              </p>
            </div>
            <div className='mt-4 md:mt-0'>
              <motion.a
                href='/assets/CertificateCC-3731.pdf'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Certificate
              </motion.a>
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
            Our calibration laboratory is regularly assessed and maintains accreditation through
            October 14, 2025.
          </p>
          <p className='mt-2 text-sm text-gray-400'>
            Current date: Tuesday, April 01, 2025, 12:35 AM IST
          </p>
        </motion.div>
      </div>
      <PDFModal
        isOpen={showCertificatePDF}
        onClose={() => setShowCertificatePDF(false)}
        title='ISO/IEC 17025:2017 Certificate'
        pdfUrl='/assets/CertificateCC-3731.pdf'
      />
      <PDFModal
        isOpen={showScopePDF}
        onClose={() => setShowScopePDF(false)}
        title='Scope of Accreditation'
        pdfUrl='/assets/Scope-CC-3731.pdf'
      />
    </div>
  );
};

export default Certification;
